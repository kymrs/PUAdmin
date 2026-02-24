$(document).ready(function() {
    // 1. INIT DATATABLES
    const table = $('#submenuTable').DataTable({
        processing: true,
        serverSide: false,
        responsive: true,
        scrollX: false,
        autoWidth: true,
        ajax: {
            url: "/api/menu/submenu/datatables", // Sesuaikan endpoint backend
            dataSrc: (json) => json.data
        },
        columns: [
            { 
                data: "id_menu",
                className: "p-5 text-center",
                render: function (data, type, row) {
                  let buttons = `<div class="flex items-center justify-center gap-2">`

                       if(row.akses?.edit){
                        buttons += `
                         <button onclick="editSubMenu(${data})" class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-colors">
                            <i class="ph-bold ph-pencil-simple text-lg"></i>
                        </button>`;
                       }
                       if(row.akses?.delete){
                        buttons += `
                           <button onclick="deleteSubMenu(${data})" class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors">
                              <i class="ph-bold ph-trash text-lg"></i>
                           </button>
                        `
                       }
                   buttons += `</div>`;
                   return buttons;
                  },
            },
            { 
                data: "nama_menu", 
                className: "p-5 font-semibold text-gray-900 dark:text-white",
                render: (data, type, row) => `
                    <div class="flex items-center gap-2">
                        <i class="ph-bold ph-arrow-elbow-down-right text-gray-400"></i>
                        <span>${data}</span>
                    </div>`
            },
            { 
                data: "link", 
                className: "p-5",
                render: data => `<span class="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-mono">${data}</span>`
            },
            { 
                data: "parent_id", // Pastikan backend melempar nama parent
                className: "p-5",
                render: (data, type, row) => `
                    <span class="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100">
                        ${data || 'N/A'}
                    </span>`
            },
            { data: "urutan", className: "p-5 text-center dark:text-white" },
            { 
                data: "is_active", 
                className: "p-5",
                render: data => `
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${data === 'Y' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-500'}">
                        <span class="w-1.5 h-1.5 rounded-full ${data === 'Y' ? 'bg-green-600' : 'bg-gray-400'}"></span>
                        ${data === 'Y' ? 'Active' : 'Inactive'}
                    </span>`
            }
        ],
        dom: 'rtip'
    });

    // Custom Search
    $('#subMenuSearch').on('keyup', function() {
        table.search(this.value).draw();
    });

    // 2. SUBMIT ACTION
    document.getElementById("submitSubMenuBtn").addEventListener("click", async () => {
      const id = document.getElementById("hidden_id_submenu").value;
      const payload = {
        nama_menu: document.getElementById("nama_menu").value,
        link: document.getElementById("link").value,
        icon: document.getElementById("icon").value,
        id_menu: document.getElementById("sub_id_parent").value,
        urutan: document.getElementById("urutan").value,
        is_active: document.getElementById("is_active").value,
      }

      const isUpdate = id !== "";
      const url = isUpdate ? `/api/menu/${id}` : `/api/menu`;
      const method = isUpdate ? "PUT" : "POST";

      try{
        const res = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = res.json;

        if (res.ok) {
        swal("Berhasil!", data.message || "Submenu berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
      } catch(error) {
         swal("Error!", "Gagal menghubungi server", "error");
      }
    })
});

// 3. HELPER FUNCTIONS
function openSubMenuModal() {
    document.getElementById('submenuForm')[0].reset();
    document.getElementById('hidden_id_submenu').value = '';
    document.getElementById('modalSubTitle').innerText = 'Tambah Sub Menu';
    document.getElementById('submenuModal').classList.remove('hidden');
}

function closeSubMenuModal() {
    document.getElementById('submenuModal').classList.add('hidden');
}

async function editSubMenu(id) {
    try {
        const res = await fetch(`/api/menu/${id}`);
        const json = await res.json();
        if (json.status === "success") {
            const m = json.data;
            document.getElementById('hidden_id_submenu').value =m.id_menu;
            document.getElementById('sub_nama_menu').value = m.nama_menu;
            document.getElementById('sub_link').value = m.link;
            document.getElementById('sub_icon').value = m.icon;
            document.getElementById('sub_id_parent').value = m.id_menu ; // Sesuaikan key parent anda
            document.getElementById('sub_urutan').value = m.urutan;
            document.getElementById('sub_is_active').value = m.is_active ;
            
            document.getElementById('modalSubTitle').text('Edit Sub Menu');
            document.getElementById('submenuModal').removeClass('hidden');
        }
    } catch (err) { swal("Error", "Gagal load data", "error"); }
}

function deleteSubMenu(id) {
    swal({
        title: "Hapus Sub Menu?",
        icon: "warning",
        buttons: ["Batal", "Ya, Hapus"],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
            if (data.status === "success") {
              swal("Terhapus!", data.message, "success");
              $("#submenuTable").DataTable().ajax.reload();
            } else {
              swal("Gagal!", data.message, "error");
            }
        }
    });
}