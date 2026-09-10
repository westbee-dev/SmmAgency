using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmmAgency.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntitiesForV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloggerId",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "ManagerName",
                table: "Campaigns");

            migrationBuilder.AddColumn<int>(
                name: "BloggerId",
                table: "PostStats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ManagerName",
                table: "PostStats",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Bloggers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloggerId",
                table: "PostStats");

            migrationBuilder.DropColumn(
                name: "ManagerName",
                table: "PostStats");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Bloggers");

            migrationBuilder.AddColumn<int>(
                name: "BloggerId",
                table: "Campaigns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ManagerName",
                table: "Campaigns",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
