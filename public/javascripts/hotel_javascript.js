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
      { data: 'jarak', title: 'Jarak' },
      { data: 'fasilitas', title: 'Fasilitas' },
      { data: 'image', title: 'Image', render: function(data, type, row){
        if(data){
          return `<img src="public/assets/img/uploads/${data}" alt="Hotel Image" class="img-hotel" />`;
        } 
          return 'No Image';
      } },
      
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
  document.getElementById("submitHotelBtn").addEventListener("click", async (e) => {
    const formData = new FormData();
    const id = document.getElementById("hidden_id").value;
    formData.append("name", document.getElementById("name").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("rating", document.getElementById("rating").value);
    formData.append("jarak", document.getElementById("jarak").value);
    formData.append("fasilitas", document.getElementById("fasilitas").value);

    const image = document.getElementById("image");
    if(image.files[0]){
      formData.append("image", image.files[0]);
    }


    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/hotels/hotel/${id}` : `/api/hotels/hotel`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
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
          const hotel = data.data;

            document.getElementById("hidden_id").value = hotel.id;
            document.getElementById("name").value = hotel.name;
            document.getElementById("location").value = hotel.location;
            document.getElementById("rating").value = hotel.rating;
            document.getElementById("jarak").value = hotel.jarak;
            document.getElementById("fasilitas").value = hotel.fasilitas;
            document.getElementById("image").value = hotel.image;
            const preview = document.getElementById("previewImage");

            if (hotel.image) {
              preview.src = `/assets/img/uploads/${hotel.image}`;
              preview.style.display = "block";
            } else {
              preview.style.display = "none";
            }


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
