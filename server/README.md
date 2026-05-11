# nest g resource user-profile --no-specq

Middleware:

Runs before the route handler (controller) is called.
Has access to the raw request and response objects.
Cannot access the result of the handler.
Used for logging, authentication, request transformation, etc.
Similar to Express middleware.

________________________________________________________________________________________________________________________________________

Interceptor:

Runs before and after the route handler.
Can access and modify the handler’s result (response).
Works with RxJS Observables.
Used for logging, response mapping, error handling, caching, etc.
More powerful for cross-cutting concerns.

________________________________________________________________________________________________________________________________________

Guard:

Runs before the route handler.
Determines whether the request should proceed (returns true/false or throws an exception).
Used for authentication and authorization (e.g., checking roles, permissions, or tokens).
Has access to the execution context (can read request, user, route info).
Does not access or modify the response.

________________________________________________________________________________________________________________________________________


Summary Table:

Feature           | Middleware        | Interceptor                  | Guard
__________________|___________________|______________________________|_________________________
Runs before       | Yes               | Yes                          | Yes
__________________|___________________|______________________________|_________________________
Runs after        | No                | Yes                          | No
__________________|___________________|______________________________|_________________________
Access response   | No                | Yes (can modify)             | No
__________________|___________________|______________________________|_________________________
Use cases         | Auth, logging,    | Logging, transform, caching, | Auth, authorization,
                  | parsing           | response mapping             | route protection
__________________|___________________|______________________________|_________________________
RxJS support      | No                | Yes                          | No


________________________________________________________________________________________________________________________________________

# PrimaryGeneratedColumn vs. @PrimaryGeneratedColumn('uuid') vs PrimaryColumn

If you want TypeORM to auto-generate the value (e.g., auto-increment or UUID), 
you would use @PrimaryGeneratedColumn() or @PrimaryGeneratedColumn('uuid').
With @PrimaryColumn(), you can set the value manually—so you can assign the 
Supabase user ID as the primary key, as you are doing.
