using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium.Migrations
{
    /// <inheritdoc />
    public partial class Removedblogrelationshipforreaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_Blog_BlogId",
                table: "Reactions");

            migrationBuilder.DropIndex(
                name: "IX_Reactions_BlogId",
                table: "Reactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Reactions_BlogId",
                table: "Reactions",
                column: "BlogId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_Blog_BlogId",
                table: "Reactions",
                column: "BlogId",
                principalTable: "Blog",
                principalColumn: "BlogId");
        }
    }
}
