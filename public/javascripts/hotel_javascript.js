document.addEventListener("DOMContentLoaded", () => {

  $('#hotelTable').DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: '/api/hotels/hotel/datatables', // Backend endpoint
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
        //   console.log("Data ID:", row); // Debugging log
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning hotelEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger hotelDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        }
      },
      { data: 'name', title: 'Nama Hotel' },
      { data: 'location', title: 'Location' },
      { data: 'rating', title: 'Rating' },
      { data: 'description', title: 'Deskripsi' },
      { data: 'createdAt', title: 'Dibuat Pada' }
    ],
    drawCallback: function () {
      // Force redraw untuk sync header & body
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    },
    "columnDefs": [
      {
        "targets": [],
        "className": 'dt-body-nowrap'
      }, {
        "targets": [],
        "orderable": false,
      },
      ]
  });

  // CREATE OR UPDATE
  document.getElementById("submitHotelBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id").value;
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const rating = document.getElementById("rating").value;
    const description = document.getElementById("description").value;

    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/hotels/hotel/${id}` : `/api/hotels/hotel`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          rating,
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Hotel berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

//   // MENGISI VALUE FORM (EDIT)
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".hotelEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".hotelEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/hotels/hotel/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const travel = data.data;

            document.getElementById("hidden_id").value = travel.id;
            document.getElementById("name").value = travel.name;
            document.getElementById("location").value = travel.location;
            document.getElementById("rating").value = travel.rating;
            document.getElementById("description").value = travel.description;

          const modal = new bootstrap.Modal(document.getElementById("hotelFormModal"));
          modal.show();
        } else {
          swal("Gagal", "Hotel tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

//   // RESET SAAT MENUTUP MODAL
  document.getElementById('hotelFormModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById("hotelInput").reset();
    document.getElementById("hidden_id").value = '';
  });

//   // DELETE
  document.addEventListener("click", (e) => {
    if (e.target.closest(".hotelDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".hotelDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/hotels/hotel/${id}`, {
              method: "DELETE",
            });

            const data = await res.json();

            if (data.status === "success") {
              swal({
                icon: "success",
                title: "Terhapus!",
                text: data.message,
                timer: 1500,
                buttons: false,
              }).then(() => {
                location.reload();
              });
            } else {
              swal("Gagal!", data.message || "Terjadi kesalahan", "error");
            }
          } catch (err) {
            swal("Error!", "Gagal menghubungi server", "error");
          }
        }
      });
    }
  });
});
