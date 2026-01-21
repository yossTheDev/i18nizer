# Undetectable Code Right Now

## code 1

``` tsx
   <span
          className={clsx(
            "text-xs text-muted-foreground",
            viewed && "opacity-60"
          )}
        >
          {createdAt
            ? (() => {
                const diff = Math.floor(
                  (Date.now() - createdAt.getTime()) / 1000
                );
                if (diff < 60) return "Hace unos minutos";
                if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
                if (diff < 86400)
                  return `Hace ${Math.floor(diff / 3600)} horas`;
                if (diff < 604800)
                  return `Hace ${Math.floor(diff / 86400)} días`;git
                return createdAt.toLocaleString();
              })()
            : "Justo ahora"}
        </span>
```

### code 2

``` jsx
   {some.property ?? "Not specified"}
```

### code 3

No processing strings in className and key

``` jsx
<button
              key={`${name.id}-other-${lastname}`}
              onClick={() => setAction(lastname)}
              className={`relative whitespace-nowrap px-4 py-2 font-medium focus:outline-none transition duration-150 ${
                active === name
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              } ${namesApproved[name] ? "border-green-600 text-green-600" : ""}`}
            >
              {role}
            </button>

```

## code 4

Are processing text under ClassNames and Key
