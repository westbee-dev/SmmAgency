using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmmAgency.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueInstagramHandleIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Businesses_InstagramHandle",
                table: "Businesses",
                column: "InstagramHandle",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bloggers_InstagramHandle",
                table: "Bloggers",
                column: "InstagramHandle",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Businesses_InstagramHandle",
                table: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Bloggers_InstagramHandle",
                table: "Bloggers");
        }
    }
}
