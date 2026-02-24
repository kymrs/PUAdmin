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
                render: (data, type, row) => `
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="editSubMenu(${data})" class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-colors">
                            <i class="ph-bold ph-pencil-simple text-lg"></i>
                        </button>
                        <button onclick="deleteSubMenu(${data})" class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors">
                            <i class="ph-bold ph-trash text-lg"></i>
                        </button>
                    </div>`
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
    $('#submitSubMenuBtn').on('click', async function() {
        const id = $('#hidden_id_submenu').val();
        const payload = {
            nama_menu: $('#sub_nama_menu').val(),
            link: $('#sub_link').val(),
            icon: $('#sub_icon').val(),
            id_menu: $('#sub_id_parent').val(), // Parent ID
            urutan: parseInt($('#sub_urutan').val()),
            is_active: $('#sub_is_active').val()
        };

        const isUpdate = id !== "";
        const url = isUpdate ? `/api/menu/${id}` : `/api/menu`;
        const method = isUpdate ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                swal("Berhasil!", "Data submenu disimpan", "success");
                closeSubMenuModal();
                table.ajax.reload();
            } else {
                swal("Gagal!", data.message, "error");
            }
        } catch (err) {
            swal("Error!", "Koneksi gagal", "error");
        }
    });
});

// 3. HELPER FUNCTIONS
function openSubMenuModal() {
    $('#submenuForm')[0].reset();
    $('#hidden_id_submenu').val('');
    $('#modalSubTitle').text('Tambah Sub Menu');
    $('#submenuModal').removeClass('hidden');
}

function closeSubMenuModal() {
    $('#submenuModal').addClass('hidden');
}

async function editSubMenu(id) {
    try {
        const res = await fetch(`/api/menu/${id}`);
        const json = await res.json();
        if (json.status === "success") {
            const m = json.data;
            $('#hidden_id_submenu').val(m.id_menu);
            $('#sub_nama_menu').val(m.nama_menu);
            $('#sub_link').val(m.link);
            $('#sub_icon').val(m.icon);
            $('#sub_id_parent').val(m.parent_id || m.id_parent_field_anda); // Sesuaikan key parent anda
            $('#sub_urutan').val(m.urutan);
            $('#sub_is_active').val(m.is_active);
            
            $('#modalSubTitle').text('Edit Sub Menu');
            $('#submenuModal').removeClass('hidden');
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
            if (res.ok) {
                swal("Terhapus", "Sub menu berhasil dihapus", "success");
                $('#submenuTable').DataTable().ajax.reload();
            }
        }
    });
}