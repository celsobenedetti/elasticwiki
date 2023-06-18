# TRPC

tRPC allows us to write end-to-end typesafe APIs without any code generation

It uses TypeScript ingerence to infer you API router's type definitions, and lets you call API procedures from your frontend with full typesafety and autocompletion

## Backend definitions

With tRPC, you write TypeScript functions on your backend, and then call them from your frontend. A tRPC procedure could look like this:

```typescript
const userRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
});
```

This is a tRPC procedure (equivalent to a route hadnelr in a traditional backend) that:

- Validates the input using Zod (make sure the `input` field is a string)
- Chains a resolver function which can be either a `query`, `mutation` or a `subscription`
- The resolver calls prisma to fetch a user by id

Procedures are defined in `routers`, which in T3, are centralized in an `appRouter`

```typescript
const appRouter = createTRPCRouter({
  users: userRouter,
  posts: postRouter,
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;
```

## Frontend usage

tRPC provides a wrapper for `react-query`, which lets you utilize the power of the hooks they provide, but with t he added benefit of having the API calls typed and inferred. Procedures are call from the front end like:

```typescript
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const UserPage = () => {
  const { query } = useRouter();
  const userQuery = api.users.getById.useQuery(query.id);

  return (
    <div>
      <h1>{userQuery.data?.name}</h1>
    </div>
  );
};
```
