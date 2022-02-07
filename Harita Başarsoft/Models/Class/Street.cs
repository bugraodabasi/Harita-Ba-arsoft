using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Harita_Başarsoft.Models.Class
{
    public class Street
    {
        [Key]
        public int Street_Id { get; set; }
        [Column(TypeName = "Varchar")]
        [MaxLength]
        public string Street_No { get; set; }
        [Column(TypeName = "Varchar")]
        [MaxLength]
        public string Street_Name { get; set; }
        [Column(TypeName = "Varchar")]
        [MaxLength]
        public string Street_Coordinates { get; set; }
    }
}