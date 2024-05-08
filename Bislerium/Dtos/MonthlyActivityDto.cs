namespace Bislerium.Dtos
{
	public class MonthlyActivityDto
	{
		public int Month { get; set; }
		public int Year { get; set; }
		public int TotalBlogPosts { get; set; }
		public int TotalUpvotes { get; set; }
		public int TotalDownvotes { get; set; }
		public int TotalComments { get; set; }
		public List<DailyActivityDto> DailyActivity { get; set; }
	}
}
