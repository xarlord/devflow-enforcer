# Java Coding Agent

## Agent Specification

## Agent Capabilities
- Java feature development (Spring Boot)
- JUnit test implementation
- Checkstyle/SpotBugs enforcement

### Configuration Options
load: true # Load only this agent spec when needed

## Responsibilities

1. **Feature Development** (Phase 7c)
   - Implement functional code
   - Implement test code
   - Follow Java best practices
   - Ensure proper exception handling

2. **Linting** (Phase 7d)
   - Run Checkstyle
   - Run SpotBugs
   - Fix all linting errors
   - Ensure code style consistency

3. **Test Implementation**
   - Write JUnit tests
   - Achieve 95% coverage
   - Ensure 100% pass rate

## Tech Stack

**Language:** Java 17+
**Framework:** Spring Boot (default)
**Testing:** JUnit 5, Mockito
**Linting:** Checkstyle, SpotBugs, PMD
**Build:** Maven/Gradle
**BDD:** Cucumber JVM

## Development Checklist

Before marking development complete:

- [ ] Code implements all requirements
- [ ] Code follows Java best practices
- [ ] Tests written for all functionality
- [ ] Checkstyle passes with 0 errors
- [ ] SpotBugs passes with 0 bugs
- [ ] Coverage >= 95%
- [ ] All tests pass (100%)
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any development:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - Java related
   - Similar feature types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Quality Gates

| Metric | Target | Action |
|--------|--------|--------|
| Checkstyle Errors | 0 | Fix before proceeding |
| SpotBugs Bugs | 0 | Fix before proceeding |
| Test Coverage | 95% | Write more tests |
| Test Pass Rate | 100% | Fix failing tests |

## Code Snippets

### Spring Boot Controller Template

```java
package com.example.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @PostMapping("/feature")
    public ResponseEntity<FeatureDto> createFeature(
            @Valid @RequestBody CreateFeatureRequest request) {
        Feature created = featureService.create(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/feature/{id}")
    public ResponseEntity<FeatureDto> getFeature(@PathVariable Long id) {
        return featureService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
    }
}
```

### JUnit Test Template

```java
package com.example.app.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FeatureServiceTest {

    private FeatureRepository repository;
    private FeatureService service;

    @BeforeEach
    void setUp() {
        repository = mock(FeatureRepository.class);
        service = new FeatureService(repository);
    }

    @Test
    @DisplayName("Should create feature successfully")
    void shouldCreateFeature() {
        // Given
        CreateFeatureRequest request = new CreateFeatureRequest("test");
        when(repository.save(any())).thenReturn(new Feature(1L, "test"));

        // When
        Feature result = service.create(request);

        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("test");
        verify(repository).save(any());
    }

    @Test
    @DisplayName("Should throw exception for invalid input")
    void shouldThrowForInvalidInput() {
        // Given
        CreateFeatureRequest request = new CreateFeatureRequest("");

        // When/Then
        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ValidationException.class);
    }
}
```

### Checkstyle Configuration

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
    "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
    "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
    <property name="severity" value="warning"/>
    <module name="TreeWalker">
        <module name="UnusedImports"/>
        <module name="RedundantImport"/>
        <module name="IllegalImport" default="^(sun\.|com\.sun\.|java\.lang\.reflect)"/>
    </module>
</module>
```

### Maven Configuration

```xml
<project>
    <dependencies>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Code Quality -->
        <dependency>
            <groupId>com.github.spotbugs</groupId>
            <artifactId>spotbugs-annotations</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-checkstyle-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>com.github.spotbugs</groupId>
                <artifactId>spotbugs-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## Common Patterns

### Service Layer Pattern

```java
@Service
@Transactional
public class FeatureService {

    private final FeatureRepository repository;
    private final FeatureMapper mapper;

    // Constructor injection (preferred over @Autowired)
    public FeatureService(FeatureRepository repository, FeatureMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Feature findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Feature not found: " + id));
    }

    @Transactional
    public Feature create(CreateFeatureRequest request) {
        // Validate
        validateRequest(request);

        // Map and save
        Feature entity = mapper.toEntity(request);
        return repository.save(entity);
    }

    private void validateRequest(CreateFeatureRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ValidationException("Name is required");
        }
    }
}
```

### Exception Handling

```java
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred"));
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
        checkstyleErrors: number;
        spotBugs: number;
        pmdViolations: number;
        status: 'pass' | 'fail';
    };
    lessonsApplied: string[];
}

const result: AgentResult<DevelopmentData> = {
    status: 'success',
    summary: 'Implemented user service with 95% coverage',
    nextPhase: 'code-review',
    criticalFindings: [],
    data: {
        filesCreated: ['UserService.java', 'UserRepository.java', 'UserServiceTest.java'],
        linesOfCode: 280,
        classesImplemented: 3,
        tests: {
            files: ['UserServiceTest.java'],
            cases: 12,
            coverage: 95,
            passRate: 100
        },
        linting: { checkstyleErrors: 0, spotBugs: 0, pmdViolations: 1, status: 'pass' },
        lessonsApplied: ['LESSON-2024-005: Use @Nullable for optional returns']
    }
};
```
