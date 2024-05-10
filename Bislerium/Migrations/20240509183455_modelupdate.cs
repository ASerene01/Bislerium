using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium.Migrations
{
    /// <inheritdoc />
    public partial class modelupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentReactions_AspNetUsers_UserId",
                table: "CommentReactions");

            migrationBuilder.DropIndex(
                name: "IX_CommentReactions_UserId",
                table: "CommentReactions");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "CommentReactions",
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
                table: "CommentReactions",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommentReactions_UserId",
                table: "CommentReactions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReactions_AspNetUsers_UserId",
                table: "CommentReactions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
