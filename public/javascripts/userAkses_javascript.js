document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userlevelTable").addEventListener("click", async (e) => {
    const detailBtn = e.target.closest(".userlevelDetail");
    if (!detailBtn) return;

    e.preventDefault();
    const idLevel = detailBtn.dataset.id;
    if(!idLevel){
      console.error("ID is not found");
      return;
    }

    try {
      const res = await fetch(`/api/userlevel/by-level/${idLevel}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const menus = data.data.menus;      // semua menu & submenu
      const akses = data.data.akses;      // semua akses yang sudah tersimpan
      console.log("FULL RESPONSE:", data);
      console.log("menus:",menus);
      console.log("akses:",akses);


      const tbody = document.querySelector("#userAksesT tbody");
      tbody.innerHTML = "";
      const menusSafe = (menus || []).filter(m => m && m.id_menu);

      menusSafe.forEach((menu, index) => {
        // Tentukan apakah ini menu utama
        if (menu.parent_id === null) {
          const aksesMenu = akses.find(a => a.id_menu === menu.id_menu) || defaultAkses(menu.id_menu);

          // const viewIcon = menus?.view_level === 'Y'
          // ? iconCheck('view_level', 'menu', menu.id_menu, )
          // : iconCross('view_level', 'menu', menu.id_menu);

          const tr = document.createElement("tr");
          tr.className = "table-success";
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${menu.nama_menu}</td>
            <td class="text-center">${makeIcon('view_level', aksesMenu)}</td>
            <td colspan="5" class="bg-light"></td>
          `;
          tbody.appendChild(tr);

          // tampilkan semua submenu dari menu ini
          menus
            .filter(sub => sub.parent_id === menu.id_menu)
            .forEach(sub => {
              const aksesSub = akses.find(b => b.id_menu === sub.id_menu) || defaultAkses(sub.id_menu);

              const trSub = document.createElement("tr");
              trSub.className = "table-info";
              trSub.innerHTML = `
                <td></td>
                <td>${sub.nama_menu}</td>

                ${permissionIcon("view_level", aksesSub)}
                ${permissionIcon("add_level", aksesSub)}
                ${permissionIcon("edit_level", aksesSub)}
                ${permissionIcon("delete_level", aksesSub)}
                ${permissionIcon("print_level", aksesSub)}
                ${permissionIcon("upload_level", aksesSub)}
              `;
              tbody.appendChild(trSub);
            });
        }
      });

      const modal = new bootstrap.Modal(document.getElementById("aksesModal"));
      modal.show();
    } catch (err) {
      console.log("Error",err);
      alert(err);
    }
  });


  // =====================
  // FUNGSI DEFAULT AKSES
  // =====================
  function defaultAkses(id_menu) {
    return {
      id: null,
      id_menu,
      view_level: "N",
      add_level: "N",
      edit_level: "N",
      delete_level: "N",
      print_level: "N",
      upload_level: "N"
    };
  }


  // =====================
  // ICON BUILDER
  // =====================

  function makeIcon(field, akses) {
    const active = akses[field] === "Y";
    return `
      <i class="fas ${active ? "fa-check-circle text-success" : "fa-times-circle text-danger"}"
         data-id="${akses.id}"
         data-id_menu="${akses.id_menu}"
         data-field="${field}"
         style="cursor:pointer">
      </i>
    `;
  }

  function permissionIcon(field, akses) {
    return `<td class="text-center">${makeIcon(field, akses)}</td>`;
  }


  // =========================
  // TOGGLE ICON CLICK HANDLER
  // =========================
  document.querySelector("#userAksesT tbody").addEventListener("click", (e) => {
    const icon = e.target.closest("i");
    if (!icon) return;

    if (icon.classList.contains("text-success")) {
      icon.classList.remove("text-success", "fa-check-circle");
      icon.classList.add("text-danger", "fa-times-circle");
    } else {
      icon.classList.remove("text-danger", "fa-times-circle");
      icon.classList.add("text-success", "fa-check-circle");
    }
  });


  // =================================
  // SUBMIT AKSES (UPSERT FINAL)
  // =================================
  document.getElementById("submitAksesBtn").addEventListener("click", async () => {
    const icons = document.querySelectorAll("#userAksesT tbody i");
    const aksesList = {};

    // kumpulkan data per menu
    icons.forEach(icon => {
      const id = icon.getAttribute("data-id");
      const id_menu = icon.getAttribute("data-id_menu");
      const field = icon.getAttribute("data-field");

      const status = icon.classList.contains("text-success") ? "Y" : "N";

      if (!aksesList[id_menu]) {
        aksesList[id_menu] = {
          id: id !== "null" ? id : null,
          id_menu,
          view_level: "N",
          add_level: "N",
          edit_level: "N",
          delete_level: "N",
          print_level: "N",
          upload_level: "N"
        };
      }

      aksesList[id_menu][field] = status;
    });

    const dataToSend = Object.values(aksesList);

    try {
      const res = await fetch("/api/userlevel/upsert-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akses: dataToSend })
      });

      const result = await res.json();

      if (res.ok) {
        swal("Berhasil!", result.message, "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", result.message || "Terjadi kesalahan", "error");
      }

    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

});
