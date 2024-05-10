using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium.Migrations
{
    /// <inheritdoc />
    public partial class commentreactionremove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentReactions_Comments_CommentId",
                table: "CommentReactions");

            migrationBuilder.DropIndex(
                name: "IX_CommentReactions_CommentId",
                table: "CommentReactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CommentReactions_CommentId",
                table: "CommentReactions",
                column: "CommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReactions_Comments_CommentId",
                table: "CommentReactions",
                column: "CommentId",
                principalTable: "Comments",
                principalColumn: "CommentId");
        }
    }
}
