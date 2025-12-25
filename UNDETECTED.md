# Undetectable Code Righ Now

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
                  return `Hace ${Math.floor(diff / 86400)} días`;
                return createdAt.toLocaleString();
              })()
            : t("justNow")}
        </span>
```
