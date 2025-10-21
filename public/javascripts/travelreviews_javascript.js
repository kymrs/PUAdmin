document.addEventListener("DOMContentLoaded", () => {
  $('#travelreviews').DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: '/api/travelreviews/datatables', // Backend endpoint
      type: 'GET',
      dataSrc: function (json) {
        console.log("DataTables response:", json); // Debugging log
        return json.data; // Extract the data array
      }
    },
    columns: [
            {
        data: 'id',
        render: function (data, type, row) {
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning travelReviewsEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger travelReviewsDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        }
      },
      { data: 'travel_id', title: 'Travel ID' },
      { data: 'user_id', title: 'User ID' },
      { data: 'rating', title: 'Rating' },
      { data: 'comment', title: 'Comment' },
      { data: 'created_at', title: 'Dibuat Pada' }
    ],
    drawCallback: function () {
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }
  });

  // CREATE OR UPDATE
  document.getElementById("submitTravelReviewsBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id").value;
    const travel_id = document.getElementById("travel_id").value;
    const user_id = document.getElementById("user_id").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/travelreviews/${id}` : `/api/travelreviews`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          travel_id,
          user_id,
          rating: parseInt(rating),
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Travel Review berhasil disimpan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

  // MENGISI VALUE FORM (EDIT)
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".travelReviewsEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".travelReviewsEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/travelreviews/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const review = data.data;

          document.getElementById("hidden_id").value = review.id;
          document.getElementById("travel_id").value = review.travel_id;
          document.getElementById("user_id").value = review.user_id;
          document.getElementById("rating").value = review.rating;
          document.getElementById("comment").value = review.comment;

          const modal = new bootstrap.Modal(document.getElementById("travelReviewsFormModal"));
          modal.show();
        } else {
          swal("Gagal", "Travel Review tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

  // RESET SAAT MENUTUP MODAL
  document.getElementById('travelReviewsFormModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById("travelReviewsForm").reset();
    document.getElementById("hidden_id").value = '';
  });

  // DELETE
  document.addEventListener("click", (e) => {
    if (e.target.closest(".travelReviewsDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".travelReviewsDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/travelreviews/${id}`, {
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