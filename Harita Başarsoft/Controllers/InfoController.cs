using Harita_Başarsoft.Models.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Harita_Başarsoft.Controllers
{
    public class InfoController : Controller
    {
        Context info = new Context();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult BilgiVer(int? id, string tip)
        {

            if (id == null)
            {
                return Json(new { hata = "ID Bilgisi Gönderilmedi" });
            }

            if (tip == "Kapı")
            {
                Door kapi = info.Doors.Find(id);

                if (kapi == null)
                {
                    return Json(new { hata = "Bilgi Bulunamadı" });
                }
                else
                {
                    return Json(new { bilgi = kapi });
                }

            }


            return Json(new { bilgi = "" });
        }
    }
}