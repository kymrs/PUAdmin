document.addEventListener("DOMContentLoaded", function() {

    let roadmapIndex = 0 ;
    document.getElementById('addRoadmap').addEventListener('click', addRoadmap );
   
    // Tambah Itinerary 
    function addRoadmap() {
        const container = document.getElementById('roadmap_option');

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-2';

        row.innerHTML = `
                                    <div class="col-2">
                                        <input type="text" class="form-control" value="Hari ${roadmapIndex + 1}" readonly>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="roadmap[${roadmapIndex}][location]" placeholder="Location" required>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="roadmap[${roadmapIndex}][activity]" placeholder="Activity" required>
                                    </div>
                                    <div class="col-md-2">
                                        <a href="#" class="btn btn-sm btn-danger roadmapDelete">
                                        <i class="fa fa-times"></i>
                                        </a>
                                    </div>
        `;
            row.querySelector('.roadmapDelete').addEventListener('click', () => {
                row.remove();
                updateRoadmapOrder();
                roadmapIndex--;
            });

            container.appendChild(row);
            roadmapIndex++;
    }

    function updateRoadmapOrder() {
        const rows = document.querySelectorAll("#roadmap_option .row");
        rows.forEach((row, index) => {
            row.querySelector("input[readonly]").value = index + 1;
        });
    }

    document.querySelectorAll(".tag-name")
    .forEach(initTagComponent);

    // LOAD DATA HOTEL UNTUK PRODUCT
    loadHotels();
    document.getElementById("formProduct").addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Ambil hotel_ids (multi select)
        const selectedHotels = Array.from(
        document.getElementById("hotelSelect").selectedOptions
        ).map(opt => opt.value);

        formData.delete("hotel_ids[]");
        selectedHotels.forEach(id => {
        formData.append("hotel_ids[]", id);
        });

        try {
        const res = await fetch("/api/product", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            swal("Berhasil", "Produk berhasil disimpan", "success");
            setTimeout(() => {
            window.location.href = "/products";
            }, 1500);
        } else {
            swal("Gagal", data.message || "Terjadi kesalahan", "error");
        }

        } catch (err) {
        console.error(err);
        swal("Error", "Gagal menghubungi server", "error");
        }
    })
    // LOAD FASILITAS TAMBAHAN
    loadFacilities();
});

async function loadFacilities() {
    const container = document.getElementById('facility-list-container')
    try {
        const res = await fetch('/api/facilities/facility');
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil fasilitas")
        }

        const facilities = result.data;
        facilities.innerHTML = '';

        if(facilities.length === 0){
            container.innerHTML = "<p class='text-center'>Kosong</p> ";
            return;
        }
        
        facilities.forEach(item => {
            const facilityItem = `
                             <div class="d-flex align-items-center gap-2">
                                <div class="list-group-item d-flex justify-content-between align-items-center flex-grow-1 border-1 rounded-3">
                                        <span><i class="${item.icon} text-muted me-2" style="font-size: 0.8rem;"></i> ${item.name}</span>
                                        <i class="fas fa-check-circle text-success"></i>
                                </div>
                                 <button class="btn btn-light border btn-sm py-2 px-3 text-muted">—</button>
                            </div>
                        `;
            container.insertAdjacentHTML('beforeend', facilityItem)
        })

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="text-center text-danger small">Error: ${error.message}</p>`;
    }
}

async function loadHotels() {
    try {
        const res = await fetch('/api/hotels/hotel/');
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil hotel");
        }

        const select = document.getElementById("hotelSelect");
        select.innerHTML = "";

        // Multiple Select Hotel
        $(document).ready(function (){
            $(select).select2({
                placeholder: "Pilih Hotel..."
            })
        })

         result.data.forEach(hotel => {
            const option = document.createElement("option");
            option.value = hotel.id;
            option.textContent = `${hotel.name} - ${hotel.location}`;
            select.appendChild(option);
        });

    } catch (error) {
         console.error(err);
         alert("Gagal memuat data hotel");
    }
}

new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
}).format(harga)

function validateFileExtension(thumbnail) {
    if(!/.(\.jpg|\.jpeg|\.png|\.gif)$/i.test(thumbnail.value)) {
        alert("Hanya file gambar yang diizinkan (jpg, jpeg, png, gif).");
        thumbnail.value = "";
        thumbnail.focus();
        return false;
    }
    return true;
}

function initTagComponent(tagInclude) {
    const input = tagInclude.querySelector('.tag-name input');
    var tags = [];

    function createTag(label) {
        const div = document.createElement('div');
        div.setAttribute('class', 'tag')
        const span = document.createElement('span');
        span.innerHTML = label;
        const closeBtn = document.createElement('i');
        closeBtn.setAttribute('class', 'fas fa-times');
        closeBtn.setAttribute('data-item', label)

        div.appendChild(closeBtn);
        div.appendChild(span);
      
        return div;

    }

    function addTag() {
        reset();
        tags.slice().reverse().forEach(function(tag){
            const input = createTag(tag);
            tagInclude.prepend(input);
        })
    }

    function reset(){
        tagInclude.querySelectorAll('.tag').forEach(function(tag){
            tag.parentElement.removeChild(tag)
        })
    }


    input.addEventListener('keydown', function(e) {
        if(e.key === 'Enter'){
            e.preventDefault();
            if(!input.value.trim()) return;

            tags.push(input.value.trim());
            addTag();
            input.value = "";
        }
    });

    tagInclude.addEventListener('click', function(e) {
        if(e.target.tagName === 'I'){
            const value = e.target.getAttribute('data-item');
            const index = tags.indexOf(value);
            tags = [...tags.slice(0, index), ...tags.slice(index + 1 )];
            addTag();
        }
    })
    
 
 
}