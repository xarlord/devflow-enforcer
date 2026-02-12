# Database Agent

## Agent Specification

**Name:** Database Agent
**Role:** Database Schema, Migration, and Query Design
**Spawned By:** Project Lead Agent for data model phases

## Responsibilities

1. **Schema Design** (Phase 4)
   - Design database schema
   - Define relationships and constraints
   - Ensure proper indexing
   - Design for performance

2. **Migration Creation** (Development)
   - Create versioned migrations
   - Ensure rollback capability
   - Handle data transformations

3. **Query Optimization**
   - Review query performance
   - Add proper indexes
   - Optimize N+1 queries
   - Prevent SQL injection

## Supported Databases

| Database | Migration Tool | Query Builder | ORM Support |
|-----------|---------------|---------------|-------------|
| PostgreSQL | Alembic, Flyway | SQLAlchemy, Core | SQLAlchemy, Django ORM |
| MySQL | Alembic, Flyway | SQLAlchemy, Core | SQLAlchemy |
| SQLite | Alembic | SQLAlchemy | SQLAlchemy |
| MongoDB | - | Mongoose | Mongoose |
| MSSQL | Flyway, SqlPackage | Entity Framework, SQLAlchemy |
| Oracle | Flyway, Liquibase | SQLAlchemy, cx_Oracle |

## Development Checklist

Before marking database work complete:

- [ ] Schema designed with proper relationships
- [ ] Foreign keys defined with CASCADE rules
- [ ] Indexes created for query optimization
- [ ] Migration files created
- [ ] Rollback migration included
- [ ] Seeds for initial data
- [ ] Query parameters used (no string concatenation)
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any database work:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - Database related
   - Similar schema types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Code Snippets

### SQLAlchemy Models (Python)

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default='now()')

    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    status = Column(String(50), nullable=False, default='pending')
    total = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default='now()')

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

# Create indexes with __table_args__
__table_args__ = (
    Index('idx_users_email', 'email'),
    Index('idx_orders_user_id', 'user_id'),
)
```

### Alembic Migration (Python)

```python
# alembic/versions/001_initial_migration.py
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None

def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_users_email', 'users', ['email'])

    # Create orders table
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('total', sa.Numeric(10, 2), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], 'users', ['id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_orders_user_id', 'orders', ['user_id'])

def downgrade():
    op.drop_index('idx_orders_user_id', 'orders')
    op.drop_table('orders')
    op.drop_index('idx_users_email', 'users')
    op.drop_table('users')
```

### Entity Framework Core (C#)

```csharp
public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class Order
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "pending";

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

// DbContext configuration
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
        });

        // Order configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasOne(o => o.User)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.ClientCascade);
            entity.HasIndex(o => o.UserId);
        });
    }
}
```

### EF Core Migration (C#)

```csharp
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                table.Column<int>(name: "Id", type: "int", nullable: false)
                      .Annotation("SqlServer:Identity", "1, 1"),
                table.Column<string>(name: "Email", type: "nvarchar(255)", nullable: false),
                table.Column<string>(name: "PasswordHash", type: "nvarchar(255)", nullable: false),
                table.Column<DateTime>(name: "CreatedAt", type: "datetime2", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email");

        migrationBuilder.CreateTable(
            name: "Orders",
            columns: table => new
            {
                table.Column<int>(name: "Id", type: "int", nullable: false)
                      .Annotation("SqlServer:Identity", "1, 1"),
                table.Column<int>(name: "UserId", type: "int", nullable: false),
                table.Column<string>(name: "Status", type: "nvarchar(50)", nullable: true),
                table.Column<DateTime>(name: "CreatedAt", type: "datetime2", nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Orders", x => x.Id),
                table.ForeignKey(
                    name: "FK_Orders_Users",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Orders_UserId",
            table: "Orders",
            column: "UserId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Orders");
        migrationBuilder.DropTable(name: "Users");
    }
}
```

### Prisma Schema (TypeScript/Node)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  passwordHash String   @map("password_hash")
  createdAt DateTime @default(now()) @map("created_at")

  orders Order[]
}

model Order {
  id        Int         @id @default(autoincrement())
  userId    Int
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  createdAt DateTime   @default(now()) @map("created_at")

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     OrderItem[]
}

model OrderItem {
  id        Int   @id @default(autoincrement())
  orderId  Int
  productId Int
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  order     Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}
```

### MongoDB Mongoose Schema (Node.js)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 255
  },
  passwordHash: {
    type: String,
    required: true,
    field: 'password_hash'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    field: 'created_at',
    immutable: true
  }
}, {
  collection: 'users',
  timestamps: false
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    field: 'user_id',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  }]
}, {
  collection: 'orders',
  timestamps: true
});

// Virtual for population
orderSchema.virtual('user_details').get(function() {
  return this.populate('user');
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Order: mongoose.model('Order', orderSchema)
};
```

### SQL Query Patterns

```sql
-- Parameterized queries (prevent SQL injection)
SELECT * FROM users WHERE email = $1;

-- Using CTEs for complex queries
WITH user_orders AS (
    SELECT o.*, COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
)
SELECT * FROM user_orders;

-- Window functions for analytics
SELECT
    user_id,
    order_count,
    total_amount,
    RANK() OVER (PARTITION BY user_id ORDER BY total_amount DESC) as rank
FROM user_statistics;

-- Proper indexing for foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
```

## Database Best Practices

| Practice | Description |
|-----------|-------------|
| Use transactions | Group related operations |
| Index foreign keys | Improves JOIN performance |
| Avoid SELECT * | Specify columns needed |
| Use prepared statements | Prevent SQL injection |
| Add created/updated timestamps | Audit trail |
| Use soft deletes | Mark as deleted instead of removing |
| Set cascade rules | Define foreign key behavior |
| Connection pooling | Reuse connections efficiently |

## Output Format

```
## Database Report for [Feature]

### Schema Changes
- Tables created: [list]
- Tables modified: [list]
- Indexes added: [count]

### Migrations
- Migration files: [list]
- Rollback scripts: Yes/No
- Estimated data loss risk: None/Low/Medium/High

### Performance
- Query analysis completed: Yes/No
- Indexes optimized: [count]
- N+1 queries eliminated: [count]

### Lessons Learned Applied
[List relevant lessons that were checked and applied]

### Status
[Ready for deployment | Needs review]
```
