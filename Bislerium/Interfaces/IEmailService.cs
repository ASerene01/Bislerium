namespace Bislerium.Interfaces
{
	public interface IEmailService
	{
		Task SendForgotPasswordEmailAsync(string name, string toEmail, string passwordResetToken);

	}
}
