using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
namespace Harita_Başarsoft.Models.Class
{
    public class Context: DbContext
    {
        public DbSet <Door> Doors { get; set; }
        public DbSet<Street> Streets { get; set; }
        
    }
}