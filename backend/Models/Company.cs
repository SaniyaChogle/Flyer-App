namespace backend.Models;

public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<Flyer> Flyers { get; set; } = new List<Flyer>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
