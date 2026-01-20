namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;  // Plain text for PoC only
    public UserRole Role { get; set; }
    public int? CompanyId { get; set; }  // Nullable for Admin, required for Company
    
    public Company? Company { get; set; }
}
