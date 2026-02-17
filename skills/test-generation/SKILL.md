---
name: test-generation
description: Generate unit tests for untested code using AI. Analyzes code structure and creates comprehensive test cases.
user-invocable: true
---

# Skill: Test Generation

## Overview

This skill generates unit tests for code:
- Analyzes code structure
- Identifies test cases
- Generates test code
- Follows testing best practices

## Purpose

Accelerate test creation and improve coverage. Use this skill:
- When adding tests to legacy code
- For improving coverage
- When learning testing patterns
- For rapid test scaffolding

## Execution Flow

```
1. ANALYZE target code
2. IDENTIFY test scenarios
3. DETECT framework (Jest, Vitest, pytest)
4. GENERATE test cases
5. APPLY testing patterns
6. OUTPUT test file
```

## Input Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| file | string | File to generate tests for | Yes |
| framework | string | jest, vitest, pytest, junit | No |
| style | string | bdd, tdd, minimal | No |
| coverage | string | Target coverage % | No |

## Test Generation Rules

### 1. Happy Path Tests
- Normal operation
- Expected inputs
- Valid outputs

### 2. Edge Cases
- Empty inputs
- Null/undefined values
- Boundary values

### 3. Error Cases
- Invalid inputs
- Exception handling
- Error messages

### 4. Integration Points
- API calls
- Database operations
- External services

## Output Format

```markdown
# Generated Tests for [filename]

**Framework:** Jest
**Generated:** [timestamp]
**Target Coverage:** 80%

## Test File

```typescript
// [filename].spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
    let service: UserService;
    let repository: Mock<UserRepository>;

    beforeEach(() => {
        repository = {
            findById: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
        } as any;
        service = new UserService(repository);
    });

    // ===== Happy Path =====

    describe('getUser', () => {
        it('should return user when found', async () => {
            // Given
            const expectedUser = { id: '1', name: 'John', email: 'john@example.com' };
            repository.findById.mockResolvedValue(expectedUser);

            // When
            const result = await service.getUser('1');

            // Then
            expect(result).toEqual(expectedUser);
            expect(repository.findById).toHaveBeenCalledWith('1');
        });
    });

    // ===== Edge Cases =====

    describe('getUser - Edge Cases', () => {
        it('should return null when user not found', async () => {
            // Given
            repository.findById.mockResolvedValue(null);

            // When
            const result = await service.getUser('999');

            // Then
            expect(result).toBeNull();
        });

        it('should throw for empty id', async () => {
            // When & Then
            await expect(service.getUser('')).rejects.toThrow('Invalid id');
        });

        it('should throw for null id', async () => {
            // When & Then
            await expect(service.getUser(null as any)).rejects.toThrow('Invalid id');
        });
    });

    // ===== Error Cases =====

    describe('getUser - Error Cases', () => {
        it('should propagate repository errors', async () => {
            // Given
            repository.findById.mockRejectedValue(new Error('Database error'));

            // When & Then
            await expect(service.getUser('1')).rejects.toThrow('Database error');
        });
    });
});
```

## Test Coverage Analysis

| Method | Scenarios | Coverage |
|--------|-----------|----------|
| getUser | 4 | 95% |
| createUser | 5 | 90% |
| updateUser | 4 | 85% |
| deleteUser | 3 | 80% |

## Additional Tests Recommended

1. **Performance Test:** Verify getUser response time
2. **Concurrency Test:** Multiple simultaneous requests
3. **Integration Test:** With real database

## Commands

Run generated tests:
```bash
npx vitest run user.service.spec.ts
```

Check coverage:
```bash
npx vitest run --coverage user.service.spec.ts
```
```

## Example Usage

### Example 1: Generate Tests for Service

```
USER: /test-generation src/services/auth.service.ts

SKILL OUTPUT:
# Generated Tests for auth.service.ts

**Framework:** Jest
**Test File:** auth.service.spec.ts

## Generated Test Cases

### AuthService.login()
| Scenario | Type | Test |
|----------|------|------|
| Valid credentials | Happy | ✅ Generated |
| Invalid email | Error | ✅ Generated |
| Invalid password | Error | ✅ Generated |
| Empty credentials | Edge | ✅ Generated |
| User not found | Error | ✅ Generated |
| Database error | Error | ✅ Generated |

### AuthService.register()
| Scenario | Type | Test |
|----------|------|------|
| Valid user data | Happy | ✅ Generated |
| Duplicate email | Error | ✅ Generated |
| Weak password | Validation | ✅ Generated |
| Invalid email format | Validation | ✅ Generated |

## Test File Created

```typescript
// auth.service.spec.ts
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { HashService } from './hash.service';

describe('AuthService', () => {
    let service: AuthService;
    let userRepo: jest.Mocked<UserRepository>;
    let hashService: jest.Mocked<HashService>;

    beforeEach(() => {
        userRepo = {
            findByEmail: jest.fn(),
            save: jest.fn(),
        } as any;
        hashService = {
            hash: jest.fn(),
            compare: jest.fn(),
        } as any;
        service = new AuthService(userRepo, hashService);
    });

    describe('login', () => {
        it('should return token for valid credentials', async () => {
            const user = { id: '1', email: 'test@example.com', password: 'hashed' };
            userRepo.findByEmail.mockResolvedValue(user);
            hashService.compare.mockResolvedValue(true);

            const result = await service.login('test@example.com', 'password');

            expect(result.token).toBeDefined();
        });

        it('should throw for invalid email', async () => {
            userRepo.findByEmail.mockResolvedValue(null);

            await expect(service.login('wrong@example.com', 'password'))
                .rejects.toThrow('Invalid credentials');
        });

        it('should throw for empty credentials', async () => {
            await expect(service.login('', ''))
                .rejects.toThrow('Email and password required');
        });
    });

    // ... more tests
});
```

**Coverage Estimate:** 85%
```

### Example 2: Generate with BDD Style

```
USER: /test-generation src/utils/validators.ts --style bdd

SKILL OUTPUT:
# Generated BDD Tests for validators.ts

**Style:** Behavior-Driven Development (Given/When/Then)

```typescript
// validators.spec.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateAge } from './validators';

describe('Email Validator', () => {
    describe('Given a valid email address', () => {
        it('should return true', () => {
            // Given
            const email = 'user@example.com';

            // When
            const result = validateEmail(email);

            // Then
            expect(result).toBe(true);
        });
    });

    describe('Given an invalid email address', () => {
        it('should return false for missing @', () => {
            // Given
            const email = 'userexample.com';

            // When
            const result = validateEmail(email);

            // Then
            expect(result).toBe(false);
        });

        it('should return false for empty string', () => {
            // Given
            const email = '';

            // When
            const result = validateEmail(email);

            // Then
            expect(result).toBe(false);
        });
    });
});
```
```

### Example 3: Generate Python Tests

```
USER: /test-generation src/services/user_service.py --framework pytest

SKILL OUTPUT:
# Generated Tests for user_service.py

**Framework:** pytest
**Test File:** test_user_service.py

```python
# test_user_service.py
import pytest
from unittest.mock import Mock, AsyncMock
from src.services.user_service import UserService

@pytest.fixture
def user_repository():
    return Mock()

@pytest.fixture
def user_service(user_repository):
    return UserService(user_repository)

class TestGetUser:
    def test_returns_user_when_found(self, user_service, user_repository):
        # Given
        expected_user = {"id": "1", "name": "John"}
        user_repository.find_by_id.return_value = expected_user

        # When
        result = user_service.get_user("1")

        # Then
        assert result == expected_user
        user_repository.find_by_id.assert_called_once_with("1")

    def test_returns_none_when_not_found(self, user_service, user_repository):
        # Given
        user_repository.find_by_id.return_value = None

        # When
        result = user_service.get_user("999")

        # Then
        assert result is None

    def test_raises_error_for_invalid_id(self, user_service):
        # When & Then
        with pytest.raises(ValueError, match="Invalid id"):
            user_service.get_user("")
```

**Run tests:**
```bash
pytest test_user_service.py -v
```
```

## Framework Templates

### Jest
```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
```

### Vitest
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
```

### pytest
```python
import pytest
from unittest.mock import Mock
```

### JUnit
```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
```

## Best Practices Applied

1. **AAA Pattern** - Arrange, Act, Assert
2. **Descriptive Names** - should_ExpectedBehavior_When_StateUnderTest
3. **Single Responsibility** - One assertion per test
4. **Isolation** - Mock all dependencies
5. **Edge Cases** - Test boundaries and nulls

## Integration

This skill integrates with:
- `coverage-analysis`: Identify what to test
- `mutation-testing`: Verify test quality
- CI/CD for automated test generation
