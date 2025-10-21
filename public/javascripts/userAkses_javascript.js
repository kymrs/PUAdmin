document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("userlevelTable").addEventListener("click", async (e) => {
        const detailBtn = e.target.closest(".userlevelDetail");
        if (detailBtn) {
          e.preventDefault();
          const id = detailBtn.getAttribute("data-id");
    
          try {
            const res = await fetch(`/api/userlevel/by-level/${id}`);
            const data = await res.json();
    
            if (!res.ok) throw new Error(data.message);
    
            const aksesMenu = data.data.aksesmenu;
            const aksesSubmenu = data.data.aksesSubmenu;

            const tbody = document.querySelector("#userAksesT tbody");
            tbody.innerHTML = ""; // Kosongkan dulu
    
            aksesMenu.forEach((menu, i) => {

              let menus = menu.Aksesmenus[0]; // Ambil akses menu dari hasil query

              const viewIcon = menus?.view_level === 'Y'
              ? iconCheck('view_level', 'menu', menus?.id, menu.id_menu)
              : iconCross('view_level', 'menu', menus?.id, menu.id_menu);

              const trMenu = document.createElement("tr");
              trMenu.className = "table-success";
              trMenu.innerHTML = `
                <td>${i + 1}</td>
                <td>${menu.nama_menu}</td>
                <td class="text-center">${viewIcon}</td>
                <td colspan="5" class="bg-light"></td>
              `;
              tbody.appendChild(trMenu);
    
              aksesSubmenu
                .filter(sub => sub.id_menu === menu.id_menu)
                .forEach(sub => {
                  let akses = sub.Aksessubmenus[0]; // Ambil akses submenu dari hasil query

                  if (akses == undefined) {
                    akses = {
                        id: sub.id,
                        id_level: sub.id_level,
                        id_submenu: sub.id_submenu,
                        view_level: 'N',
                        add_level: 'N',
                        edit_level: 'N',
                        delete_level: 'N',
                        print_level: 'N',
                        upload_level: 'N'
                    };
                }

                // console.log("Submenu:", JSON.stringify(akses, null, 2));

                  const trSub = document.createElement("tr");
                  trSub.className = "table-info";
                  trSub.innerHTML = `
                    <td></td>
                    <td>${sub.nama_submenu}</td>
                    <td class="text-center" data-level="view_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.view_level === 'Y' ? iconCheck('view_level', 'submenu', akses.id, akses.id_submenu) : iconCross('view_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                <td class="text-center" data-level="add_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.add_level === 'Y' ? iconCheck('add_level', 'submenu', akses.id, akses.id_submenu) : iconCross('add_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                <td class="text-center" data-level="edit_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.edit_level === 'Y' ? iconCheck('edit_level', 'submenu', akses.id, akses.id_submenu) : iconCross('edit_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                <td class="text-center" data-level="delete_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.delete_level === 'Y' ? iconCheck('delete_level', 'submenu', akses.id, akses.id_submenu) : iconCross('delete_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                <td class="text-center" data-level="print_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.print_level === 'Y' ? iconCheck('print_level', 'submenu', akses.id, akses.id_submenu) : iconCross('print_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                <td class="text-center" data-level="upload_level" data-id="${akses.id}" data-type="submenu" data-submenu="${akses.id_submenu}">
                  ${akses.upload_level === 'Y' ? iconCheck('upload_level', 'submenu', akses.id, akses.id_submenu) : iconCross('upload_level', 'submenu', akses.id, akses.id_submenu)}
                </td>
                  `;
                  tbody.appendChild(trSub);
                });
            });
    
            // tampilkan modal (jika kamu pakai modal)
            const modal = new bootstrap.Modal(document.getElementById("aksesModal"));
            modal.show();
    
          } catch (err) {
            console.error(err);
            alert("Gagal memuat data akses.");
          }
        }
    
        function iconCheck(level, type, id, id_detail) {
            return `<i class="fas fa-check-circle text-success" data-level="${level}" data-id="${id}" data-type="${type}" data-id_detail="${id_detail}" style="cursor: pointer;"></i>`;
          }
    
        function iconCross(level, type, id, id_detail) {
            return `<i class="fas fa-times-circle text-danger" data-level="${level}" data-id="${id}" data-type="${type}" data-id_detail="${id_detail}" style="cursor: pointer;"></i>`;
          }

      });

      // FUNCTION TOGGLE ICON STATUS
      function toggleIconStatus(icon) {
        const isActive = icon.classList.contains("text-success");
        // icon.classList.remove(isActive ? "text-success" : "text-danger", isActive ? "fa-check-circle" : "fa-times-circle");
        // icon.classList.add(isActive ? "text-danger" : "text-success", isActive ? "fa-times-circle" : "fa-check-circle");
        if (isActive) {
          // Dari aktif ke non-aktif
          icon.classList.remove("text-success", "fa-check-circle");
          icon.classList.add("text-danger", "fa-times-circle");
        } else {
          // Dari non-aktif ke aktif
          icon.classList.remove("text-danger", "fa-times-circle");
          icon.classList.add("text-success", "fa-check-circle");
        }
      }

      document.querySelector("#userAksesT tbody").addEventListener("click", async (e) => {
        const icon = e.target.closest("i");
        if (icon) {
          toggleIconStatus(icon);
        }
      });

      document.getElementById("submitAksesBtn").addEventListener("click", async (e) => {
        const icons = document.querySelectorAll("#userAksesT tbody i");
        const aksesList = [];

        icons.forEach((icon) => {
          const level = icon.getAttribute("data-level");
          const id = icon.getAttribute("data-id");
          const type = icon.getAttribute("data-type");
          const id_detail = icon.getAttribute("data-id_detail");
          const currentStatus = icon.classList.contains("text-success") ? 'Y' : 'N';
          const newStatus = currentStatus === 'Y' ? 'N' : 'Y'; // toggle status

          aksesList.push({
            level: level,
            id: id,
            type: type,
            id_detail: id_detail,
            status: currentStatus
          });
        });


        try {
          const response = await fetch("/api/userlevel/upsert-access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              akses: aksesList
            })
          });
      
          const result = await response.json();
      
          if (response.ok) {
            swal("Berhasil!", result.message || "Hak Akses berhasil deperbarui", "success");
            setTimeout(() => location.reload(), 1500);
          } else {
            swal("Gagal!", data.message || "Terjadi kesalahan saat memperbarui data", "error");
          }
        } catch (error) {
          // console.error("Error saat mengirim data:", error);
          swal("Error!", "Gagal menghubungi server", "error");
        }
      });

});