# C# Coding Agent

## Agent Specification

## Agent Capabilities
- C# feature development (ASP.NET Core)
- xUnit test implementation
- StyleCop/Roslyn Analyzers enforcement

### Configuration Options
load: true # Load only this agent spec when needed

## Responsibilities

1. **Feature Development** (Phase 7c)
   - Implement functional code
   - Implement test code
   - Follow C# best practices
   - Ensure proper async handling

2. **Linting** (Phase 7d)
   - Run StyleCop
   - Run Roslyn Analyzers
   - Fix all linting errors
   - Ensure code style consistency

3. **Test Implementation**
   - Write xUnit tests
   - Achieve 95% coverage
   - Ensure 100% pass rate

## Tech Stack

**Language:** C# 11+ / .NET 8+
**Framework:** ASP.NET Core
**Testing:** xUnit, Moq/NSubstitute
**Linting:** StyleCop Analyzers, Roslyn Analyzers, ReSharper
**Build:** MSBuild / dotnet CLI
**BDD:** SpecFlow (if applicable)

## Development Checklist

Before marking development complete:

- [ ] Code implements all requirements
- [ ] Code follows C# best practices
- [ ] Tests written for all functionality
- [ ] StyleCop passes with 0 errors
- [ ] Roslyn Analyzers pass with 0 warnings
- [ ] Coverage >= 95%
- [ ] All tests pass (100%)
- [ ] Async/await used correctly
- [ ] Dependency injection used
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any development:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - C# related
   - Similar feature types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Quality Gates

| Metric | Target | Action |
|--------|--------|--------|
| StyleCop Errors | 0 | Fix before proceeding |
| Analyzer Warnings | 0 | Fix before proceeding |
| Test Coverage | 95% | Write more tests |
| Test Pass Rate | 100% | Fix failing tests |

## Code Snippets

### Service Class Template

```csharp
namespace Application.Services;

public interface IFeatureService
{
    Task<FeatureDto> GetByIdAsync(Guid id);
    Task<FeatureDto> CreateAsync(CreateFeatureRequest request);
    Task<IEnumerable<FeatureDto>> GetAllAsync();
}

public class FeatureService : IFeatureService
{
    private readonly IFeatureRepository _repository;
    private readonly ILogger<FeatureService> _logger;

    public FeatureService(
        IFeatureRepository repository,
        ILogger<FeatureService> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<FeatureDto> GetByIdAsync(Guid id)
    {
        var feature = await _repository.GetByIdAsync(id);
        if (feature == null)
        {
            _logger.LogWarning("Feature not found: {FeatureId}", id);
            throw new NotFoundException(nameof(Feature), id);
        }

        return MapToDto(feature);
    }

    public async Task<FeatureDto> CreateAsync(CreateFeatureRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ValidationException("Name is required");
        }

        var entity = new Feature
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();

        _logger.LogInformation("Feature created: {FeatureId}", entity.Id);
        return MapToDto(entity);
    }

    private static FeatureDto MapToDto(Feature entity) =>
        new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };
}
```

### Repository Pattern

```csharp
public interface IFeatureRepository
{
    Task<Feature?> GetByIdAsync(Guid id);
    Task AddAsync(Feature feature);
    Task SaveChangesAsync();
}

public class FeatureRepository : IFeatureRepository
{
    private readonly ApplicationDbContext _context;

    public FeatureRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Feature?> GetByIdAsync(Guid id)
    {
        return await _context.Features
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task AddAsync(Feature feature)
    {
        await _context.Features.AddAsync(feature);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
```

### Controller Template

```csharp
[ApiController]
[Route("api/v1/features")]
public class FeaturesController : ControllerBase
{
    private readonly IFeatureService _featureService;

    public FeaturesController(IFeatureService featureService)
    {
        _featureService = featureService ?? throw new ArgumentNullException(nameof(featureService));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(FeatureDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeatureDto>> GetById(Guid id)
    {
        try
        {
            var result = await _featureService.GetByIdAsync(id);
            return Ok(result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(FeatureDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FeatureDto>> Create([FromBody] CreateFeatureRequest request)
    {
        try
        {
            var result = await _featureService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeatureDto>>> GetAll()
    {
        var features = await _featureService.GetAllAsync();
        return Ok(features);
    }
}
```

### xUnit Tests

```csharp
using Xunit;
using Moq;
using Application.Services;

public class FeatureServiceTests
{
    private readonly Mock<IFeatureRepository> _mockRepository;
    private readonly FeatureService _service;

    public FeatureServiceTests()
    {
        _mockRepository = new Mock<IFeatureRepository>();
        _service = new FeatureService(_mockRepository.Object, Mock.Of<ILogger<FeatureService>>().Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenFeatureExists_ReturnsFeature()
    {
        // Arrange
        var expectedFeature = new Feature { Id = Guid.NewGuid(), Name = "Test" };
        _mockRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(expectedFeature);

        // Act
        var result = await _service.GetByIdAsync(expectedFeature.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedFeature.Name, result.Name);
    }

    [Fact]
    public async Task CreateAsync_WhenNameIsEmpty_ThrowsValidationException()
    {
        // Arrange
        var request = new CreateFeatureRequest { Name = "" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => _service.CreateAsync(request)
        );

        Assert.Contains("required", exception.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateAsync_WhenNameIsInvalid_ThrowsValidationException(string? name)
    {
        // Arrange
        var request = new CreateFeatureRequest { Name = name! };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _service.CreateAsync(request)
        );
    }
}
```

### DbContext

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Feature> Features { get; set; }
 = null!;
    public DbSet<User> Users { get; set; } = null!;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Feature configuration
        modelBuilder.Entity<Feature>(entity =>
        {
            entity.ToTable("features");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();
        });
    }
}
```

### Program.cs Configuration

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services
builder.Services.AddScoped<IFeatureRepository, FeatureRepository>();
builder.Services.AddScoped<IFeatureService, FeatureService>();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// Configure middleware
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Configure Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.MapHealthChecks("/health");
app.Run();
```

### StyleCop Configuration

```xml
<!-- StyleCop.json -->
{
  "settings": {
    "indentation": {
      "indentSize": 4,
      "useTabs": false
    },
    "spacingRules": {
      "allowSpacesBeforeSquareBrackets": true
    },
    "readabilityRules": {
      "allowBuiltInTypeAliases": true
    }
  }
}
```

### Project File

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

<PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>false</TreatWarningsAsErrors>
</PropertyGroup>

<ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="1.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta" />
</ItemGroup>

<ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="xunit" Version="2.6.2" />
    <PackageReference Include="Moq" Version="4.20.70" />
    <PackageReference Include="coverlet.collector" Version="6.0.0">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime;build;native;contentfiles;analyzers</IncludeAssets>
    </PackageReference>
</ItemGroup>

```

## Common Patterns

### Result Pattern

```csharp
public static class ResultExtensions
{
    public static Result<T> ToResult<T>(this T? value) =>
        value.HasValue
            ? Result.Success(value.Value)
            : Result.Failure<T>("Value not found");
}
```

### Logging Pattern

```csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
where TRequest : notnull
where TResponse : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TRequest, TResponse> next,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {RequestName}", typeof(TRequest).Name);

        try
        {
            var response = await next(request, cancellationToken);
            _logger.LogInformation("Completed {RequestName}", typeof(TRequest).Name);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling {RequestName}", typeof(TRequest).Name);
            throw;
        }
    }
}
```

## Output Format

Return `AgentResult<DevelopmentData>`:

```typescript
interface DevelopmentData {
    filesCreated: string[];
    linesOfCode: number;
    classesImplemented: number;
    tests: {
        files: string[];
        cases: number;
        coverage: number;
        passRate: number;
    };
    linting: {
        styleCopErrors: number;
        analyzerWarnings: number;
        status: 'pass' | 'fail';
    };
    lessonsApplied: string[];
}

const result: AgentResult<DevelopmentData> = {
    status: 'success',
    summary: 'Implemented controller with dependency injection, 95% coverage',
    nextPhase: 'code-review',
    criticalFindings: [],
    data: {
        filesCreated: ['FeaturesController.cs', 'FeatureService.cs', 'FeaturesControllerTest.cs'],
        linesOfCode: 260,
        classesImplemented: 3,
        tests: {
            files: ['FeaturesControllerTest.cs'],
            cases: 13,
            coverage: 95,
            passRate: 100
        },
        linting: { styleCopErrors: 0, analyzerWarnings: 1, status: 'pass' },
        lessonsApplied: ['LESSON-2024-013: Use record types for DTOs']
    }
};
```
