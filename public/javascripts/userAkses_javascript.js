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

       function renderMenuRows(menus, akses, parentId = null, level = 0) {
            menus
              .filter(menu => menu.parent_id === parentId)
              .forEach(menu => {

                const aksesMenu =
                  akses.find(a => a.id_menu === menu.id_menu) ||
                  defaultAkses(menu.id_menu);

                const tr = document.createElement("tr");

                tr.className =
                  level === 0 ? "table-success" :
                  level === 1 ? "table-info" :
                  "table-light";

                tr.innerHTML = `
                  <td>${level === 0 ? menu.id_menu : ""}</td>
                  <td style="padding-left:${level * 25}px">
                    ${"— ".repeat(level)}${menu.nama_menu}
                  </td>

                  ${permissionIcon("view_level", aksesMenu)}
                  ${permissionIcon("add_level", aksesMenu)}
                  ${permissionIcon("edit_level", aksesMenu)}
                  ${permissionIcon("delete_level", aksesMenu)}
                  ${permissionIcon("print_level", aksesMenu)}
                  ${permissionIcon("upload_level", aksesMenu)}
                `;

                tbody.appendChild(tr);

                // 🔁 render anak-anaknya
                renderMenuRows(menus, akses, menu.id_menu, level + 1);
              });
          }
      renderMenuRows(menusSafe, akses)
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
