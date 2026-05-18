// Fungsi Pembantu untuk menampilkan Ion Alert secara dinamis
async function showAlert(header, message) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];
    alert.mode = 'ios'; // Konsisten dengan mode iOS di project Anda

    document.body.appendChild(alert);
    return alert.present();
}

async function WhatsApp() {
    // Validasi Field
    if ($('#whatsapp-order .nama').val() == '') {
        await showAlert('Data Kurang', 'Nama Wajib Dicantumkan');
        $('#whatsapp-order .nama').focus();
        return false;
    } else if ($('#whatsapp-order .nomor').val() == '') {
        await showAlert('Data Kurang', 'Nomor WhatsApp Harus Tercantum');
        $('#whatsapp-order .nomor').focus();
        return false;
    } else if ($('#whatsapp-order .alamat').val() == '') {
        await showAlert('Data Kurang', 'Mohon Isi Alamat Pengiriman');
        $('#whatsapp-order .alamat').focus();
        return false;
    } else if ($('#whatsapp-order .kota').val() == '') {
        await showAlert('Data Kurang', 'Mohon Isi Kota/Kabupaten');
        $('#whatsapp-order .kota').focus();
        return false;
    } else if ($('#whatsapp-order .provinsi').val() == '') {
        await showAlert('Data Kurang', 'Mohon Isi Provinsi');
        $('#whatsapp-order .provinsi').focus();
        return false;
    } else if ($('#whatsapp-order .bayar').val() == '') {
        await showAlert('Data Kurang', 'Pilih Metode Pembayaran');
        $('#whatsapp-order .bayar').focus();
        return false;
    } else if ($('#whatsapp-order .informasi').val() == '') {
        await showAlert('Data Kurang', 'Pilih Jasa Pengiriman');
        $('#whatsapp-order .informasi').focus();
        return false;
    } else {
        // Cek Perangkat
        var url_wa = 'https://web.whatsapp.com/send';
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            url_wa = 'whatsapp://send/';
        }

        // Ambil Item dari Cart
        var cartItem = '';
        var counter = 1;
        var rawItems = localStorage.getItem('simpleCart_items');
        if (!rawItems) {
            await showAlert('Keranjang Kosong', 'Ups, sepertinya keranjang kamu kosong!');
            return false;
        }
        
        var waItems = JSON.parse(rawItems);
        var itemsArray = Object.values(waItems);
        
        itemsArray.forEach((item) => {
            cartItem += '*' + counter + '. ' + item.name + '* %0A';
            cartItem += '   - Harga: ' + angkaToRp(item.price) + ' %0A';
            cartItem += '   - Warna: ' + (item.warna || '-') + ' %0A';
            cartItem += '   - Model: ' + (item.ukuran || 'regular') + ' %0A';
            cartItem += '   - Jumlah: ' + item.quantity + ' pcs %0A';
            cartItem += '   - Subtotal: ' + angkaToRp(item.price * item.quantity) + ' %0A%0A';
            counter++;
        });

        // Ambil Data Form
        var orderAdmin = $('#whatsapp-order .order').val() || '6281386267897';
        var nama = $('#whatsapp-order .nama').val();
        var alamat = $('#whatsapp-order .alamat').val();
        var nomor = $('#whatsapp-order .nomor').val();
        var kota = $('#whatsapp-order .kota').val();
        var provinsi = $('#whatsapp-order .provinsi').val();
        var kodepos = $('#whatsapp-order .kodepos').val();
        var metodeBayar = $('#whatsapp-order .bayar').val();
        var kurir = $('#whatsapp-order .informasi').val();
        var totalBelanja = angkaToRp(simpleCart.total());

        var message = url_wa + '?phone=' + orderAdmin + '&text=' +
            'Halo Kak, saya *' + nama + '*, mau order produk berikut:%0A%0A' +
            '-----------------------------------------%0A' +
            '*LIST BELANJAAN*%0A' +
            '-----------------------------------------%0A%0A' + cartItem +
            '*Total Belanja:* ' + totalBelanja + '%0A' +
            '*(belum termasuk ongkir)*%0A%0A' +
            '-----------------------------------------%0A' +
            '*DATA PENGIRIMAN*%0A' +
            '-----------------------------------------%0A' +
            '*Nama:* ' + nama + '%0A' +
            '*WhatsApp:* ' + nomor + '%0A' +
            '*Alamat:* ' + alamat + '%0A' +
            '*Kota:* ' + kota + '%0A' +
            '*Provinsi:* ' + provinsi + '%0A' +
            '*Kode Pos:* ' + kodepos + '%0A%0A' +
            '*Metode Bayar:* ' + metodeBayar + '%0A' +
            '*Jasa Kirim:* ' + kurir + '%0A' +
            '-----------------------------------------%0A%0A' +
            'Mohon segera diproses ya Kak. Terima kasih! 🙏';

        // Buka WhatsApp
        window.open(message, '_blank');
        
        // Reset Cart
        simpleCart.empty();
        if (typeof closeCheckoutModal === 'function') closeCheckoutModal();
        
        await showAlert('Berhasil', 'Pesanan kamu telah diteruskan ke WhatsApp Admin!');
        return false;
    }
}
