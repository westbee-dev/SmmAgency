# ==============================================================================
# Этап 1: Сборка и публикация .NET приложения (Build Stage)
# Используем официальный образ SDK для восстановления пакетов и компиляции
# ==============================================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. Сначала копируем файлы проектов и решения.
# Это позволяет задействовать кэш Docker: если код изменился, но зависимости нет,
# шаг `dotnet restore` будет взят из кэша и сборка пройдет мгновенно.
COPY SmmAgency.slnx ./
COPY SmmAgency.Api/SmmAgency.Api.csproj SmmAgency.Api/
COPY SmmAgency.Core/SmmAgency.Core.csproj SmmAgency.Core/
COPY SmmAgency.Data/SmmAgency.Data.csproj SmmAgency.Data/

RUN dotnet restore SmmAgency.slnx

# 2. Копируем все оставшиеся исходные файлы
COPY . .

# 3. Публикуем проект API в релизной конфигурации в директорию /app/publish
WORKDIR /src/SmmAgency.Api
RUN dotnet publish SmmAgency.Api.csproj -c Release -o /app/publish --no-restore

# ==============================================================================
# Этап 2: Финальный легковесный образ среды выполнения (Runtime Stage)
# Образ aspnet содержит только среду выполнения .NET (без тяжелого SDK и компилятора)
# ==============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Копируем скомпилированные бинарные файлы из этапа сборки
COPY --from=build /app/publish .

# Задаем порт 5000 по умолчанию внутри контейнера
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

# Точка входа для запуска API при старте контейнера
ENTRYPOINT ["dotnet", "SmmAgency.Api.dll"]
