document.addEventListener("DOMContentLoaded", function() {
    loadCategory(); 
    fetchHotelFacility()

    const noteInput = document.getElementById('note');
    const btnAddNote = document.getElementById('addNote');
    const noteContainer = document.getElementById('note-container');
    let roadmapIndex = 0 ;
    const termsInput = document.getElementById('snk');
    const termsContainer = document.getElementById('snk-container');
    document.getElementById('addRoadmap').addEventListener('click', addRoadmap );

    window.facilityState = {
        include: new Set(),
        exclude: new Set()
    };
    let thumbnail_file = "";
    let hotelImageFiles = {
        Mekkah: null,
        Madinah: null
    };



    // Global State
    const ProductState = {
        category_id: null,
        nama_produk: "",
        tgl_keberangkatan: "",
        quota: 0,
        duration: 0,
        tmp_keberangkatan: "",
        thumbnail_url: "",
        description: "",
        status: ""
    }
    // price State
    const ProductPriceState = {
        Quad: {
            price: 0
        },
        Double: {
            price: 0
        },
        Triple: {
            price: 0
        }
    }
    // flight state
    const ProductFlightState = {
       Departure: {
            airlane_name: ""
       },
       Return: {
            airlane_name: ""
       }
    }
    //Facility state= 
    const ProductFacilityState = {
        INCLUDE: [],
        EXCLUDE:[],
    }
    // SnK state
    const ProductSnKState = []
    // note state
    const ProductNoteState =  []
    // hotel state
    const ProductHotelState = {
        Mekkah: {
            name: "",
            rating: null,
            jarak: "",
            image: "",
            facilities: new Set()
    },
        Madinah: {
            name: "",
            rating: null,
            jarak: "",
            image: "",
            facilities: new Set()
        }
    }
    const ProductItineraryState = []

    document.getElementById("nama_produk").addEventListener("input", (e) => {
        ProductState.nama_produk = e.target.value;
    });
    $('#category_id').on('change', function () {
    const value = $(this).val();
    ProductState.category_id = value ? Number(value) : null;
});

    document.getElementById("date").addEventListener("input", (e) => {
        ProductState.tgl_keberangkatan = e.target.value;
    })
    document.getElementById("tmp_keberangkatan").addEventListener("input", (e) => {
        ProductState.tmp_keberangkatan = e.target.value;
    })
    document.getElementById("duration").addEventListener("input", (e) => {
        ProductState.duration = e.target.value;
    })
    document.getElementById("quota").addEventListener("input", (e) => {
        ProductState.quota = Number(e.target.value);
    })
    document.getElementById("thumbnail").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return;

        thumbnail_file = file;
        ProductState.thumbnail_url = file.name;
    })
      document.getElementById("description").addEventListener("input", (e) => {
        ProductState.description = e.target.value;
    })
    document.getElementById("flight_kbrkt").addEventListener("input", (e) => {
        ProductFlightState.Departure.airlane_name = e.target.value
    })
    document.getElementById("flight_kplg").addEventListener("input", (e) => {
        ProductFlightState.Return.airlane_name = e.target.value
    })
    document.getElementById("status").addEventListener("change", (e) => {
        ProductState.status = e.target.value;
    })
    document.getElementById("price_quad").addEventListener("input", (e) => {
        ProductPriceState.Quad.price = Number(e.target.value);
    })
    document.getElementById("price_triple").addEventListener("input", (e) => {
        ProductPriceState.Triple.price = Number(e.target.value);
    })
    document.getElementById("price_double").addEventListener("input", (e) => {
        ProductPriceState.Double.price = Number(e.target.value);
    })
    document.getElementById("include-fclty").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();

            const value = e.target.value.trim();
            if(!value) return;

            ProductFacilityState.INCLUDE.push(value);
            addIncludeFacility(value);
            e.target.value = "";
        }
    })
    document.getElementById("exclude-fclty").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();

            const value = e.target.value.trim();
            if(!value) return;

            ProductFacilityState.EXCLUDE.push(value);
            addExcludeFacility(value);
            e.target.value = "";
        }
    })
    document.getElementById("snk").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();

            const value = e.target.value.trim();
            if(!value) return;

            ProductSnKState.push(value);
            addTerms();
            e.target.value= "";
        }
    })
    document.getElementById("note").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();

            const value = e.target.value.trim();
            if(!value) return;

            ProductNoteState.push(value);
            addNewNote();
            e.target.value= "";
        }
    })
    document.getElementById("hotel_mekkah_image")
        .addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            hotelImageFiles.Mekkah = file;
        });
    
        document.getElementById("hotel_madinah_image")
        .addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            hotelImageFiles.Madinah = file;
        });

    function collectHotelData() {
        ProductHotelState.Mekkah.name =
            document.querySelector("#hotel_mekkah input[type=text]").value;

        ProductHotelState.Mekkah.rating =
            document.querySelector("#hotel_mekkah select").value;

        ProductHotelState.Mekkah.jarak =
            document.querySelector("#hotel_mekkah input[placeholder='Contoh: 50m(Pelantaran)']").value;


        ProductHotelState.Madinah.rating =
            document.querySelector("#hotel_madinah select").value;

        ProductHotelState.Madinah.jarak =
            document.querySelector("#hotel_madinah input[placeholder='Contoh: 50m(Pelantaran)']").value;
    }
    document.addEventListener("change", (e) => {
        if (!e.target.classList.contains("facility-checkbox")) return;

        const type = e.target.dataset.city; // MEKKAH / MADINAH
        const value = e.target.value;

        if (e.target.checked) {
            ProductHotelState[type].facilities.add(value);
        } else {
            ProductHotelState[type].facilities.delete(value);
        }

        // console.log(type, [...ProductHotelState[type].facilities]);
    });
    document.getElementById("roadmap_option").addEventListener("input", (e) => {
       const index = parseInt(e.target.dataset.index);
       if(index === undefined) return;

       if(e.target.classList.contains("itinerary-title")) {
        ProductItineraryState[index].title = e.target.value;
       }

       if(e.target.classList.contains("itinerary-desc")) {
        ProductItineraryState[index].description = e.target.value;
       }

    })

    // const formatedFacilities = [
    //          ...ProductFacilityState.INCLUDE.map(f => ({
    //             type: "INCLUDE",
    //             facility: f
    //         })),
    //         ...ProductFacilityState.EXCLUDE.map(f => ({
    //             type: "EXCLUDE",
    //             facility: f
    //         }))

    // ]
    
    const payload = {
        products: ProductState,
        
        prices: Object.entries(ProductPriceState).map(([type, val]) => ({
            type,
            price: Number(val.price) || 0
        })),
        
        flights: [
            {type: "Departure", airlane_name: ProductFlightState.Departure.airlane_name},
            {type: "Return", airlane_name: ProductFlightState.Return.airlane_name},
        ],

        hotels: [
            {
            city: "Mekkah",
            ...ProductHotelState.Mekkah,
            facilities: [...ProductHotelState.Mekkah.facilities]
            },
            {
            city: "Madinah",
            ...ProductHotelState.Madinah,
            facilities: [...ProductHotelState.Madinah.facilities]
            }
        ],

        facilities: [
            // {
            //     type: "INCLUDE",
            //     ...ProductFacilityState.INCLUDE,
            // },
            // {
            //     type: "EXCLUDE",
            //     ...ProductFacilityState.EXCLUDE
            // }
             ...ProductFacilityState.INCLUDE.map(f => ({
                type: "INCLUDE",
                facility: f
            })),
            ...ProductFacilityState.EXCLUDE.map(f => ({
                type: "EXCLUDE",
                facility: f
            }))
        ],

        snk: ProductSnKState,
        notes: ProductNoteState,
        itinerary: ProductItineraryState
    }

    // SUBMIT NEW PRODUCT START
    document.getElementById("formProduct").addEventListener("submit", async(e) => {
        e.preventDefault();
        collectHotelData();
        console.log("SUBMIT KE TRIGGER");

          if (!ProductState.category_id) {
                alert("Category belum dipilih!");
                return;
            }
        const formData = new FormData();
        Object.entries(ProductState).forEach(([key, value]) => {
            formData.append(key, value);
        })

        formData.append("prices", JSON.stringify(Object.entries(ProductPriceState).map(([type, val]) => ({
                type,
                price: Number(val.price)
            }))
        )),
        
        formData.append("flights", JSON.stringify([
            {type: "Departure", airlane_name: ProductFlightState.Departure.airlane_name},
            {type: "Return", airlane_name: ProductFlightState.Return.airlane_name},
        ]))
       
        formData.append("hotels", JSON.stringify([
            { city:"Mekkah",
            ...ProductHotelState.Mekkah,
            facilities: [...ProductHotelState.Mekkah.facilities]
            },
            { city:"Madinah",
            ...ProductHotelState.Madinah,
            facilities: [...ProductHotelState.Madinah.facilities]
            }
        ]));

        formData.append("facilities", JSON.stringify([
            ...ProductFacilityState.INCLUDE.map(f => ({
                type: "INCLUDE",
                facility: f
            })),
            ...ProductFacilityState.EXCLUDE.map(f => ({
                type: "EXCLUDE",
                facility: f
            }))
        ]));
        // 🔹 itinerary
        ProductItineraryState.forEach((item, index) => {
            item.day_order = index + 1;
        });
        formData.append("itineraries", JSON.stringify(
            ProductItineraryState
        ));

        // 🔹 snk & note
        formData.append("snk", JSON.stringify(ProductSnKState));
        formData.append("notes", JSON.stringify(ProductNoteState));
        

        if(thumbnail_file){
            formData.append("thumbnail", thumbnail_file)
        }
        if (hotelImageFiles.Mekkah) {
        formData.append("hotel_image_mekkah", hotelImageFiles.Mekkah);
        }

        if (hotelImageFiles.Madinah) {
        formData.append("hotel_image_madinah", hotelImageFiles.Madinah);
        }

        for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
          }

        try{
            const res = await fetch("/api/products/products", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                swal("Berhasil", data.message || "Product Berhasil Ditambahkan")
                    console.log("FORM SUBMIT JALAN");
            } else {
                swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
                    console.log("FORM SUBMIT TIDAK JALAN");
            }
        } catch (error) {
            swal("Error!", "Gagal menghubungi server", "error");
        }
    })

   
    // SUBMIT NEW PRODUCT END

    async function fetchHotelFacility() {
    // Ambil semua elemen dengan class tersebut
    const containers = document.querySelectorAll(".facility-container");
    
    try {
        const res = await fetch("/api/facilities/facility/");
        const result = await res.json();

        if (result.status !== "success") {
            throw new Error("Gagal ambil fasilitas hotel");
        }

        // Kita looping setiap container yang ada di halaman (Mekkah & Madinah)
        containers.forEach((container) => {
            container.innerHTML = ""; // Kosongkan loading

            // Di dalam setiap container, kita looping data fasilitasnya
            result.data.forEach((facility) => {
                // Beri prefix unik pada ID agar ID checkbox Mekkah tidak bentrok dengan Madinah
                const uniqueId = `${container.id || 'fac'}-${facility.id}`;
                const cityType = container.id === "mekkah_fclty" 
                ? "Mekkah" 
                : "Madinah";
                
                const checkboxHTML = `
                    <input type="checkbox" 
                           name="facility_ids" 
                           class="btn-check facility-checkbox" 
                           id="${uniqueId}" 
                           autocomplete="off" 
                           data-city="${cityType}"
                           value="${facility.id}">
                    <label class="btn btn-outline-primary text-dark mb-1" for="${uniqueId}">
                        ${facility.name}
                    </label>
                `;
                
                container.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        });

    } catch (error) {
        console.error(error);
        // Tampilkan error di semua container
        containers.forEach(c => c.innerHTML = `<span class="text-danger">Gagal memuat.</span>`);
    }
    }
    async function loadCategory() {
        try {
            const res = await fetch('/api/galleries/galleryCategory/')
            const result = await res.json();

            if(result.status !== "success"){
                throw new Error("Gagal ambil hotel");
            }
            
            const selectElements = document.querySelectorAll(".category_id");
            selectElements.forEach(select=>{
                select.innerHTML = "<option value=''>Pilih Kategori...</option>";

                result.data.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = `${category.name}`;
                    select.appendChild(option);
                });
            })

            $('.category_id').select2({
                placeholder: "Pilih Category...",
                allowClear: true,
                width: '100%'
            });


        } catch(error) {
            console.error(error);
            alert("Gagal memuat data category ");
        }
    }

// Tambah Note START
    function addNewNote() {
        
        const inputValue = noteInput.value.trim();
        if(inputValue !== ""){
                        const li = document.createElement('li');
                        li.className = "note-list d-flex justify-content-between align-items-center border-radius px-2";

                        li.innerHTML = `
                        <span>${inputValue}</span>
                        <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

                        // Masukkan ke dalam container ul
                        noteContainer.appendChild(li);

                        //meng kosongkan input
                        noteInput.value = "";
                        noteInput.focus();

                    } 
    }
    btnAddNote.addEventListener("click", function() {
        addNewNote();
    })

    noteInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addNewNote();
        }
    })
// Tambah NOTE END
// Tmbah Include Fasilitas START
    const includeInput = document.getElementById('include-fclty');
    const includeContainer = document.getElementById('include-container');

    function addIncludeFacility() {
        const inputValue = includeInput.value.trim();
        if(inputValue !== ""){
            const li = document.createElement("li");
            li.className = "include-list d-flex justify-content-between align-items-center border-radius px-2";

            li.innerHTML = `
            <span>${inputValue}</span>
            <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

            includeContainer.appendChild(li);
            includeInput.value = "";
            includeInput.focus();
        } 
    }
    
    includeInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addIncludeFacility();
        }
    })
    // Tmbah Include Fasilitas END

    // Tmbah Exclude Fasilitas START
    const excludeInput = document.getElementById('exclude-fclty');
    const excludeContainer = document.getElementById('exclude-container');

    function addExcludeFacility() {
        const inputValue = excludeInput.value.trim();
        if(inputValue !== ""){
            const li = document.createElement("li");
            li.className = "exclude-list d-flex justify-content-between align-items-center border-radius px-2";

            li.innerHTML = `
            <span>${inputValue}</span>
            <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

            excludeContainer.appendChild(li);
            excludeInput.value = "";
            excludeInput.focus();
        } 
    }
    
    excludeInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addExcludeFacility();
        }
    })
    // Tmbah Exclude Fasilitas END

    // Tambah Syarat & Ketentuan START
        function addTerms() {
            const inputValue = termsInput.value.trim();
            if(inputValue !== ""){
                const li = document.createElement("li");
                li.className = "snk-list d-flex justify-content-between align-items-center border-radius px-2";

                li.innerHTML = `
                <span>${inputValue}</span>
                <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

                termsContainer.appendChild(li);
                termsInput.value = "";
                termsInput.focus();
            }
        }
        termsInput.addEventListener("keydown", function(e) {
            if(e.key === "Enter"){
                e.preventDefault();
                addTerms();
            }
        })
    // Tmbah Syarat & Ketentuan END
    // Tambah Itinerary START
    function addRoadmap() {
        const container = document.getElementById('roadmap_option');
        const currentIndex = ProductItineraryState.length;

          ProductItineraryState.push({
                day_order: currentIndex + 1,
                title: "",
                description: "",
            });

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-2';

             row.innerHTML = `
                <div class="col-2">
                    <input type="text"
                    class="form-control itinerary-day"
                    data-index="${roadmapIndex}"
                    value="${currentIndex + 1}"
                    readonly>
                </div>

                <div class="col-md-4">
                    <input type="text"
                    class="form-control itinerary-title"
                    data-index="${currentIndex}"
                    placeholder="Location"
                    required>
                </div>

                <div class="col-md-4">
                    <input type="text"
                    class="form-control itinerary-desc"
                    data-index="${currentIndex}"
                    placeholder="Activity"
                    required>
                </div>

                <div class="col-md-2">
                   <button type="button" class="btn btn-sm btn-danger roadmapDelete">
                        <i class="fa fa-times"></i>
                    </button>

                </div>
            `;

            row.querySelector('.roadmapDelete').addEventListener('click', () => {

                const index = parseInt(
                    row.querySelector(".itinerary-title").dataset.index
                )
                ProductItineraryState.splice(index, 1)
                row.remove();
                updateRoadmapOrder();
                
            });
             container.appendChild(row);
             roadmapIndex++;
    }
    // Tambah Itinerary END

    function updateRoadmapOrder() {

                document.querySelectorAll(".itinerary-day").forEach((el, idx) => {
                    el.value = idx + 1;
                });

                document.querySelectorAll(".itinerary-title").forEach((el, idx) => {
                    el.dataset.index = idx;
                });

                document.querySelectorAll(".itinerary-desc").forEach((el, idx) => {
                    el.dataset.index = idx;
                });

                ProductItineraryState.forEach((item, idx) => {
                    item.day_order = idx + 1;
                });
    }


});
   