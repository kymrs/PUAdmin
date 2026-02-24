document.addEventListener("DOMContentLoaded", function() {
    // --- INITIALIZATION ---
    loadCategory();

    // --- STATES ---
    const ProductState = {
        category_id: null,
        nama_produk: "",
        tgl_keberangkatan: "",
        quota: 0,
        duration: 0,
        tmp_keberangkatan: "",
        thumbnail_url: "",
        description: "",
        status: "draft"
    };

    const ProductPriceState = [
        { type: "Quad", price: 0 },
        { type: "Double", price: 0 },
        { type: "Triple", price: 0 }
    ];

    const ProductFlightState = {
        Departure: { airline_name: "" },
        Return: { airline_name: "" }
    };

    const ProductHotelState = {
        Mekkah: { name: "", rating: null, jarak: "", facilities: "" },
        Madinah: { name: "", rating: null, jarak: "", facilities: "" }
    };

    const ProductFacilityState = { INCLUDE: [], EXCLUDE: [] };
    const ProductSnKState = [];
    const ProductNoteState = [];
    const ProductItineraryState = [];

    let thumbnail_file = null;
    let hotelImageFiles = { Mekkah: null, Madinah: null };

    // --- UI HELPERS (TAILWIND STYLE) ---

    // Helper untuk membuat List Item (Note, SnK, Facility)
    function createListItem(text, containerId, stateArray, colorClass = "bg-gray-50") {
        const container = document.getElementById(containerId);
        const li = document.createElement('li');
        li.className = `flex justify-between items-center ${colorClass} dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700 transition-all group`;
        
        li.innerHTML = `
            <span class="text-sm text-gray-700 dark:text-gray-300">${text}</span>
            <button type="button" class="text-gray-400 hover:text-red-500 transition-colors">
                <i class="ph-bold ph-x"></i>
            </button>
        `;

        li.querySelector('button').addEventListener('click', () => {
            const index = stateArray.indexOf(text);
            if (index > -1) stateArray.splice(index, 1);
            li.remove();
        });

        container.appendChild(li);
    }

    // --- EVENT LISTENERS ---

    // Input Utama
    document.getElementById("nama_produk").addEventListener("input", (e) => ProductState.nama_produk = e.target.value);
    document.getElementById("date").addEventListener("input", (e) => ProductState.tgl_keberangkatan = e.target.value);
    document.getElementById("tmp_keberangkatan").addEventListener("input", (e) => ProductState.tmp_keberangkatan = e.target.value);
    document.getElementById("duration").addEventListener("input", (e) => ProductState.duration = e.target.value);
    document.getElementById("quota").addEventListener("input", (e) => ProductState.quota = Number(e.target.value));
    document.getElementById("description").addEventListener("input", (e) => ProductState.description = e.target.value);
    document.getElementById("status").addEventListener("change", (e) => ProductState.status = e.target.value);
    
    // Maskapai
    document.getElementById("flight_kbrkt").addEventListener("input", (e) => ProductFlightState.Departure.airline_name = e.target.value);
    document.getElementById("flight_kplg").addEventListener("input", (e) => ProductFlightState.Return.airline_name = e.target.value);

    // Kategori (Select2)
    $('#category_id').on('change', function () {
        ProductState.category_id = $(this).val() ? Number($(this).val()) : null;
    });

    // File Uploads
    document.getElementById("thumbnail").addEventListener("change", (e) => {
        thumbnail_file = e.target.files[0];
        if (thumbnail_file) ProductState.thumbnail_url = thumbnail_file.name;
    });

    document.getElementById("hotel_mekkah_image").addEventListener("change", (e) => hotelImageFiles.Mekkah = e.target.files[0]);
    document.getElementById("hotel_madinah_image").addEventListener("change", (e) => hotelImageFiles.Madinah = e.target.files[0]);

    // Price Inputs (Mapping dari ID partials)
    ['price_quad', 'price_triple', 'price_double'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", (e) => {
                const type = id.replace('price_', '').charAt(0).toUpperCase() + id.replace('price_', '').slice(1);
                const item = ProductPriceState.find(p => p.type === type);
                if (item) item.price = Number(e.target.value);
            });
        }
    });

    // Dynamic Lists (Enter Keys)
    const setupListInput = (inputId, containerId, stateArray, color) => {
        document.getElementById(inputId).addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const val = e.target.value.trim();
                if (val && !stateArray.includes(val)) {
                    stateArray.push(val);
                    createListItem(val, containerId, stateArray, color);
                    e.target.value = "";
                }
            }
        });
    };

    setupListInput("include-fclty", "include-container", ProductFacilityState.INCLUDE, "bg-green-50/50");
    setupListInput("exclude-fclty", "exclude-container", ProductFacilityState.EXCLUDE, "bg-red-50/50");
    setupListInput("snk", "snk-container", ProductSnKState, "bg-gray-50");
    setupListInput("note", "note-container", ProductNoteState, "bg-blue-50/50");

    // --- ITINERARY LOGIC (TAILWIND UI) ---
    document.getElementById('addRoadmap').addEventListener('click', () => {
        const container = document.getElementById('roadmap_option');
        const index = ProductItineraryState.length;

        const item = { day_order: index + 1, title: "", description: "" };
        ProductItineraryState.push(item);

        const div = document.createElement('div');
        div.className = "relative group itinerary-item mb-4";
        div.innerHTML = `
            <span class="absolute -left-[2.1rem] top-4 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-dark-card"></span>
            <div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-semibold text-gray-500 uppercase">Hari</label>
                        <input type="text" value="${item.day_order}" readonly class="itinerary-day w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 font-bold text-center">
                    </div>
                    <div class="md:col-span-3">
                        <label class="block text-xs font-semibold text-gray-500 uppercase">Lokasi</label>
                        <input type="text" placeholder="Lokasi" class="itinerary-title w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 outline-none focus:border-primary-500">
                    </div>
                    <div class="md:col-span-6">
                        <label class="block text-xs font-semibold text-gray-500 uppercase">Aktivitas</label>
                        <input type="text" placeholder="Aktivitas" class="itinerary-desc w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 outline-none focus:border-primary-500">
                    </div>
                    <div class="md:col-span-1 flex items-end justify-end">
                        <button type="button" class="p-2 text-red-500 hover:bg-red-50 rounded-lg btn-remove-roadmap">
                            <i class="ph-bold ph-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Sync inputs with state
        div.querySelector('.itinerary-title').addEventListener('input', (e) => item.title = e.target.value);
        div.querySelector('.itinerary-desc').addEventListener('input', (e) => item.description = e.target.value);
        div.querySelector('.btn-remove-roadmap').addEventListener('click', () => {
            const idx = ProductItineraryState.indexOf(item);
            if (idx > -1) ProductItineraryState.splice(idx, 1);
            div.remove();
            updateRoadmapOrder();
        });

        container.appendChild(div);
    });

    function updateRoadmapOrder() {
        document.querySelectorAll('.itinerary-item').forEach((el, idx) => {
            const newDay = idx + 1;
            el.querySelector('.itinerary-day').value = newDay;
            ProductItineraryState[idx].day_order = newDay;
        });
    }

    // --- SUBMIT LOGIC ---
    function collectHotelData() {
        // Mekkah
        const mekkahRoot = document.getElementById("hotel_mekkah");
        ProductHotelState.Mekkah.name = mekkahRoot.querySelector("input[name='include']").value;
        ProductHotelState.Mekkah.rating = mekkahRoot.querySelector("select").value;
        ProductHotelState.Mekkah.jarak = mekkahRoot.querySelector("input[placeholder='50m']").value;
        ProductHotelState.Mekkah.facilities = document.getElementById("mekkah_fclty").value;

        // Madinah
        const madinahRoot = document.getElementById("hotel_madinah");
        ProductHotelState.Madinah.name = madinahRoot.querySelector("input[name='exclude']").value;
        ProductHotelState.Madinah.rating = madinahRoot.querySelector("select").value;
        ProductHotelState.Madinah.jarak = madinahRoot.querySelector("input[placeholder='100m']").value;
        ProductHotelState.Madinah.facilities = document.getElementById("madinah_fclty").value;
    }

    document.getElementById("formProduct").addEventListener("submit", async (e) => {
        e.preventDefault();
        collectHotelData();

        if (!ProductState.category_id) return swal("Oops!", "Kategori belum dipilih", "warning");

        const formData = new FormData();

        // Append Data Utama
        Object.entries(ProductState).forEach(([key, val]) => formData.append(key, val));

        // Append Complex Data as Strings (Agar sinkron dengan Controller Backend kamu)
        formData.append("prices", JSON.stringify(ProductPriceState));
        formData.append("flights", JSON.stringify([
            { type: "Departure", airline_name: ProductFlightState.Departure.airline_name },
            { type: "Return", airline_name: ProductFlightState.Return.airline_name }
        ]));
        formData.append("hotels", JSON.stringify([
            { city: "Mekkah", ...ProductHotelState.Mekkah },
            { city: "Madinah", ...ProductHotelState.Madinah }
        ]));
        formData.append("facilities", JSON.stringify([
            ...ProductFacilityState.INCLUDE.map(f => ({ type: "INCLUDE", facility: f })),
            ...ProductFacilityState.EXCLUDE.map(f => ({ type: "EXCLUDE", facility: f }))
        ]));
        formData.append("itineraries", JSON.stringify(ProductItineraryState));
        formData.append("snks", JSON.stringify(ProductSnKState.map(s => ({ name: s }))));
        formData.append("notes", JSON.stringify(ProductNoteState.map(n => ({ note: n }))));

        // Append Files
        if (thumbnail_file) formData.append("thumbnail", thumbnail_file);
        if (hotelImageFiles.Mekkah) formData.append("hotel_image_mekkah", hotelImageFiles.Mekkah);
        if (hotelImageFiles.Madinah) formData.append("hotel_image_madinah", hotelImageFiles.Madinah);

        try {
            const res = await fetch("/api/products/products", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                swal("Berhasil", "Produk berhasil disimpan", "success").then(() => window.location.reload());
            } else {
                swal("Gagal", data.message || "Terjadi kesalahan", "error");
            }
        } catch (err) {
            swal("Error", "Gagal menghubungi server", "error");
        }
    });
});

async function loadCategory() {
    try {
        const res = await fetch('/api/galleries/galleryCategory/');
        const result = await res.json();

        if (result.status !== "success") {
            throw new Error("Gagal mengambil data kategori");
        }
        
        const selectElements = document.getElementById("category_id");
        
        if(selectElements) {
            // Reset content
            selectElements.innerHTML = "<option value='' disabled selected>Pilih kategori</option>";

            // Isi data dari API
            result.data.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                selectElements.appendChild(option);
            });

            selectElements.addEventListener('change', function (e) {
                const val = e.target.value;
                // Pastikan variabel 'ProductState' sudah terdefinisi secara global
                if (typeof ProductState !== 'undefined') {
                    ProductState.category_id = val ? Number(val) : null;
                }
                console.log("Kategori dipilih:", ProductState.category_id);
            });
            console.log("Kategori berhasil dimuat.");
        } else {
            console.error("Elemen ID 'category_id' tidak ditemukan!");
        };


    } catch (error) {
        console.error(error);
    }
}