using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        // Check if data already exists
        if (context.Companies.Any())
        {
            return; // Database already seeded
        }

        // Create companies
        var companies = new List<Company>
        {
            new Company { Name = "Company A" },
            new Company { Name = "Company B" },
            new Company { Name = "Company C" }
        };

        context.Companies.AddRange(companies);
        context.SaveChanges();

        // Create admin user
        var admin = new User
        {
            Email = "admin@flyer.com",
            Password = "admin123",
            Role = UserRole.Admin,
            CompanyId = null
        };

        // Create company users (companies logging in as users)
        var companyUsers = new List<User>
        {
            new User
            {
                Email = "companyA@flyer.com",
                Password = "company123",
                Role = UserRole.Company,
                CompanyId = companies[0].Id
            },
            new User
            {
                Email = "companyB@flyer.com",
                Password = "company123",
                Role = UserRole.Company,
                CompanyId = companies[1].Id
            },
            new User
            {
                Email = "companyC@flyer.com",
                Password = "company123",
                Role = UserRole.Company,
                CompanyId = companies[2].Id
            }
        };

        context.Users.Add(admin);
        context.Users.AddRange(companyUsers);
        context.SaveChanges();
    }
}
