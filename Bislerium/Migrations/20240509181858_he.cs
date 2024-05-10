using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium.Migrations
{
    /// <inheritdoc />
    public partial class he : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_AspNetUsers_UserId",
                table: "Reactions");

            migrationBuilder.DropIndex(
                name: "IX_Reactions_UserId",
                table: "Reactions");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Reactions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Reactions",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reactions_UserId",
                table: "Reactions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_AspNetUsers_UserId",
                table: "Reactions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
