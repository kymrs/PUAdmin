document.addEventListener("DOMContentLoaded", () => {
    $('#facilityTable').DataTable({
        processing: true,
        serverSide: true,
        responsive: false,
        scrollX: false,
        autowidth: true,
        ajax: {
            url: '/api/facilities/facility/datatables', // Backend endpoint
            type: 'GET',
            dataSrc: function (json) {
                // console.log("DataTables response:", json); // Debugging log
                return json.data; // Extract the data array
            }
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row) {
                    // console.log("Data ID:", row); // Debugging log
                    let buttons = `<div class="d-flex gap-2 justify-content-left">`;

                    if (row.akses && row.akses.edit) {
                        buttons += `
                            <a href="#" class="btn btn-sm btn-warning facilityEdit" data-id="${row.id}">
                                <i class="fa fa-edit"></i>
                            </a>`;
                    }
                    if (row.akses && row.akses.delete) {
                        buttons += `
                            <a href="#" class="btn btn-sm btn-danger facilityDelete" data-id="${row.id}">
                                <i class="fa fa-times"></i>
                            </a>`;
                    }
                    buttons += `</div>`;
                    return buttons;
                }
            },
            { data: 'name', title: 'Nama' },
            { data: 'icon', title: 'Icon' },
        ],
        drawCallback: function () {
            // Force redraw untuk sync header & body
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
        },
        // "columnDefs": [
        //     {
        //         "targets": [1,2,3,4,5],
        //         "className": 'dt-body-nowrap'
        //     }, {
        //         "targets": [0, 1],
        //         "orderable": false
        //     }
        // ]
    });
    // CREATE OR UPDATE
    document.getElementById("submitfacilityBtn").addEventListener("click", async () => {
        const id = document.getElementById("hidden_id").value;
        const name = document.getElementById("name").value;
        const icon = document.getElementById("icon").value;

        const isUpdate = id !== "";
        const url = isUpdate ? `/api/facilities/facility/${id}` : '/api/facilities/facility';
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    icon
                })
            });

            const data = await res.json();
            if(res.ok){
                swal("Berhasil", data.message || "Berhasil ditambahkan", "success");
                setTimeout(() => location.reload(), 1500);
            } else {
                swal("Gagal", data.error || "Terjadi kesalahan", "error");
            }

        } catch (error) {
            swal("Gagal", error.message || "Terjadi kesalahan", "error");
        }
    });

    // MENGISI VALUE FORM
    document.getElementById('facilityTable').addEventListener("click", async (e) => {
        if(e.target.closest(".facilityEdit")){
            e.preventDefault();
            const id = e.target.closest(".facilityEdit").getAttribute("data-id");

            try {
                const res = await fetch(`/api/facilities/facility/${id}`);
                const data = await res.json();

                if(data.status === "success"){
                    const facility = data.data;
                    

                    document.getElementById("hidden_id").value = facility.id;
                    document.getElementById("name").value = facility.name;
                    document.getElementById("icon").value = facility.icon;
                    

                    const modal = new bootstrap.Modal(document.getElementById("facilityFormModal"));
                    modal.show();
                } else {
                    swal("Gagal", data.message || "Terjadi kesalahan", "error");
                }
            } catch (error) {
                swal("Gagal", error.message || "Terjadi kesalahan", "error");
            }
        }
    });

    // RESET SAAT MENUTUP MODAL
    document.getElementById('facilityFormModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById("facilityForm").reset();
        document.getElementById("hidden_id").value = '';
    });

    // DELETE
    document.getElementById("facilityTable").addEventListener("click", async (e) => {
        if(e.target.closest(".facilityDelete")){
            e.preventDefault();
            const id = e.target.closest(".facilityDelete").getAttribute("data-id");

            swal({
                title: "Yakin ingin menghapus?",
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const res = await fetch(`/api/facilities/facility/${id}`, {
                            method: 'DELETE'
                        });
                        const data = await res.json();

                        if(res.ok){
                            swal("Berhasil", data.message || "Transaksi berhasil dihapus", "success");
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            swal("Gagal", data.error || "Terjadi kesalahan", "error");
                        }
                    } catch (error) {
                        swal("Gagal", error.message || "Terjadi kesalahan", "error");
                    }
                }
            });
        }
    })
})