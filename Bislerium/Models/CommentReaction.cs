using System.ComponentModel.DataAnnotations;

namespace Bislerium.Models
{
	public class CommentReaction
	{
		[Key]
		public int CommentReactionId { get; set; }

		public bool Upvote { get; set; } = false;
		public bool Downvote { get; set; } = false;

		public DateTime CreatedAt { get; set; } = DateTime.Now;
		public string? UserId { get; set; }
		
		public int? CommentId { get; set; }

	}
}
