document.addEventListener("DOMContentLoaded", () => {
  // --- FUNGSI HELPER MODAL TAILWIND ---
  function toggleModal(modalId, isOpen) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(modalId.replace('modal', 'backdrop'));
    const panel = document.getElementById(modalId.replace('modal', 'panel'));

    if (isOpen) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        backdrop.classList.replace('opacity-0', 'opacity-100');
        backdrop.classList.remove('pointer-events-none');
        panel.classList.replace('opacity-0', 'opacity-100');
        panel.classList.replace('scale-95', 'scale-100');
      }, 10);
    } else {
      panel.classList.replace('opacity-100', 'opacity-0');
      panel.classList.replace('scale-100', 'scale-95');
      backdrop.classList.replace('opacity-100', 'opacity-0');
      backdrop.classList.add('pointer-events-none');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }
  }

  // --- 1. CREATE ATAU UPDATE ---
  // Pastikan tombol simpan di modal "Tambah Level" punya ID "submitUserlevel"
  const submitBtn = document.getElementById("submitUserlevel");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const id = document.getElementById("hidden_id_userlevel").value;
      const nama_level = document.getElementById("level-name").value;

      const isUpdate = id !== "";
      const url = isUpdate ? `/api/userlevel/${id}` : `/api/userlevel`;
      const method = isUpdate ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_level }),
        });

        const data = await res.json();
        if (res.ok) {
          swal("Berhasil!", data.message || "Data berhasil disimpan", "success");
          setTimeout(() => location.reload(), 1500);
        } else {
          swal("Gagal!", data.message || "Terjadi kesalahan", "error");
        }
      } catch (err) {
        swal("Error!", "Gagal menghubungi server", "error");
      }
    });
  }

  // --- 2. EDIT (MENGISI FORM) ---
  window.editUserLevel = async (id) => {
    try {
      const res = await fetch(`/api/userlevel/${id}`);
      const data = await res.json();

      if (data.status === "success") {
        const userlevel = data.data;
        // Isi input di modal
        document.getElementById("hidden_id_userlevel").value = userlevel.id_level;
        document.getElementById("level-name").value = userlevel.nama_level;
        
        // Ubah Judul Modal
        document.querySelector('#add-level-panel h3').innerText = 'Edit User Level';
        toggleModal('add-level-modal', true);
      }
    } catch (err) {
      swal("Error", "Gagal mengambil data", "error");
    }
  };

  // --- 3. DELETE ---
  window.deleteUserLevel = async (id) => {
    swal({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      buttons: ["Batal", "Ya, hapus!"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const res = await fetch(`/api/userlevel/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (data.status === "success") {
            swal("Terhapus!", data.message, "success").then(() => location.reload());
          } else {
            swal("Gagal!", data.message, "error");
          }
        } catch (err) {
          swal("Error!", "Gagal menghubungi server", "error");
        }
      }
    });
  };

  // --- 4. MANAJEMEN AKSES (DETAIL) ---
  // Handler untuk tombol kunci (Akses)
  document.addEventListener("click", async (e) => {
    const detailBtn = e.target.closest(".open-access-btn");
    if (!detailBtn) return;

    const idLevel = detailBtn.dataset.id;
    const levelName = detailBtn.dataset.name;

    try {
      const res = await fetch(`/api/userlevel/by-level/${idLevel}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      document.getElementById("modal-level-name").innerText = levelName;
      const tbody = document.querySelector("#access-modal table tbody");
      tbody.innerHTML = "";

      // Render Baris Menu secara Rekursif
      renderMenuRows(data.data.menus, data.data.akses, null, 0, tbody);
      toggleModal('access-modal', true);
    } catch (err) {
      swal("Error", err.message, "error");
    }
  });

  function renderMenuRows(menus, akses, parentId, level, tbody) {
    menus.filter(m => m.parent_id === parentId).forEach(menu => {
      const aMenu = akses.find(a => a.id_menu === menu.id_menu) || {
        id: null, id_menu: menu.id_menu, view_level: "N", add_level: "N", edit_level: "N", delete_level: "N", print_level: "N", upload_level: "N"
      };

      const tr = document.createElement("tr");
      tr.className = "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors";
      
      const padding = level > 0 ? `style="padding-left: ${level * 2}rem"` : "";
      const icon = level === 0 ? 'ph-squares-four' : 'ph-arrow-elbow-down-right';

      tr.innerHTML = `
        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white" ${padding}>
          <div class="flex items-center gap-2">
            <i class="ph ${icon} text-lg ${level === 0 ? 'text-primary-600' : 'text-gray-400'}"></i>
            ${menu.nama_menu}
          </div>
        </td>
        ${['view_level', 'add_level', 'edit_level', 'delete_level', 'print_level', 'upload_level']
          .map(field => `
            <td class="px-3 py-4 text-center">
              <input type="checkbox" ${aMenu[field] === 'Y' ? 'checked' : ''} 
                class="checkbox-access accent-primary-600 w-4 h-4" 
                data-id_menu="${menu.id_menu}" data-field="${field}" data-id="${aMenu.id}">
            </td>`).join('')}
      `;
      tbody.appendChild(tr);
      renderMenuRows(menus, akses, menu.id_menu, level + 1, tbody);
    });
  }

  // --- 5. SUBMIT AKSES ---
  document.getElementById("submitAksesBtn").addEventListener("click", async () => {
    const checks = document.querySelectorAll(".checkbox-access");
    const aksesList = {};

    checks.forEach(cb => {
      const id_menu = cb.dataset.id_menu;
      const field = cb.dataset.field;
      if (!aksesList[id_menu]) aksesList[id_menu] = { id_menu, id: cb.dataset.id !== "null" ? cb.dataset.id : null };
      aksesList[id_menu][field] = cb.checked ? "Y" : "N";
    });

    try {
      const res = await fetch("/api/userlevel/upsert-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akses: Object.values(aksesList) })
      });
      if (res.ok) swal("Berhasil!", "Hak akses disimpan", "success").then(() => toggleModal('access-modal', false));
    } catch (err) {
      swal("Error", "Gagal menyimpan akses", "error");
    }
  });
});

// Fungsi Global untuk pemicu tombol modal (dipanggil via onclick di HTML)
function openAddLevelModal() {
  document.getElementById("hidden_id_userlevel").value = "";
  document.getElementById("level-name").value = "";
  document.querySelector('#add-level-panel h3').innerText = 'Tambah Level Baru';
  // Panggil fungsi toggleModal (Pastikan fungsi ini terjangkau secara scope)
  const modal = document.getElementById('add-level-modal');
  modal.classList.remove('hidden');
}

function closeAddLevelModal() {
  const modal = document.getElementById('add-level-modal');
  modal.classList.add('hidden');
}

function closeAccessModal() {
  const modal = document.getElementById('access-modal');
  modal.classList.add('hidden');
}