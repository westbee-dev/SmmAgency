using System;
using SmmAgency.Core.Entity;
using Microsoft.EntityFrameworkCore;

namespace SmmAgency.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Blogger> Bloggers { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<PostStats> PostStats { get; set; }


    }
}
