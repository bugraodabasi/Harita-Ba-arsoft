using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Harita_Başarsoft.Models.Class
{
    public class Door
    {
        [Key]
        public int Door_Id { get; set; }
        [Column(TypeName = "Varchar")]
        [MaxLength]
        public string Door_No { get; set; }
        public int Street_No { get; set; }
        public float X { get; set; }
        public float Y { get; set; }



    }
}