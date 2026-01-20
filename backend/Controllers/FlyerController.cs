using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlyerController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public FlyerController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // Get all companies (for admin dropdown)
    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies()
    {
        var companies = await _context.Companies
            .Select(c => new { c.Id, c.Name })
            .ToListAsync();
        return Ok(companies);
    }

    // Upload flyer (Admin only - no auth middleware, just trust client for PoC)
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFlyer([FromForm] FlyerUploadRequest request)
    {
        if (request.File == null || request.File.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
        var fileExtension = Path.GetExtension(request.File.FileName).ToLower();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Only PNG and JPG files are allowed" });
        }

        // Create uploads directory if it doesn't exist
        var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        // Generate unique filename
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsPath, uniqueFileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream);
        }

        // Save flyer metadata to database
        var flyer = new Flyer
        {
            Title = request.Title,
            ImagePath = $"/uploads/{uniqueFileName}",
            CompanyId = request.CompanyId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Flyers.Add(flyer);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Flyer uploaded successfully", flyer });
    }

    // Get flyers for a specific company
    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetFlyersByCompany(int companyId)
    {
        var flyers = await _context.Flyers
            .Where(f => f.CompanyId == companyId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                f.Id,
                f.Title,
                f.ImagePath,
                f.CompanyId,
                f.CreatedAt
            })
            .ToListAsync();

        return Ok(flyers);
    }

    // Download flyer
    [HttpGet("download/{id}")]
    public async Task<IActionResult> DownloadFlyer(int id)
    {
        var flyer = await _context.Flyers.FindAsync(id);
        if (flyer == null)
        {
            return NotFound(new { message = "Flyer not found" });
        }

        var filePath = Path.Combine(_environment.WebRootPath, flyer.ImagePath.TrimStart('/'));
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound(new { message = "File not found" });
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        var fileName = Path.GetFileName(filePath);
        return File(fileBytes, "image/jpeg", fileName);
    }

    // Delete flyer
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFlyer(int id)
    {
        var flyer = await _context.Flyers.FindAsync(id);
        if (flyer == null)
        {
            return NotFound(new { message = "Flyer not found" });
        }

        // Delete physical file
        var filePath = Path.Combine(_environment.WebRootPath, flyer.ImagePath.TrimStart('/'));
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        // Delete database record
        _context.Flyers.Remove(flyer);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Flyer deleted successfully" });
    }
}

public class FlyerUploadRequest
{
    public string Title { get; set; } = string.Empty;
    public int CompanyId { get; set; }
    public IFormFile? File { get; set; }
}
