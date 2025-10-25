# lab8-ai-services
COMP305 Fall 2025 Lab 8 assignment
## Big Picture Design Decisions & Trade-offs

### 1. **Client-Side API Calls (Biggest Decision)**

**What I did for API testing:**
- Browser directly calls API
- API key in browser

**Pros:**
- Simple to implement
- No backend needed
- Fast (one less hop)
- Good for learning

**Cons:**
- 🚨 API key exposed to anyone with dev tools
- 🚨 API key in browser history, network logs
- Can't enforce rate limits
- Can't monitor usage
- Can't switch providers without updating client code

