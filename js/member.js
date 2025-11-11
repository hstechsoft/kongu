$(document).ready(function () {

    // expose functions used by inline onclick handlers
    window.openMap = function () {
        const url = prompt("Paste Google Maps URL after selecting a location:");
        if (url) $('#location_url').val(url);
    };
    window.nominee = function () {
        const url = prompt("Paste Google Maps URL after selecting a location:");
        if (url) $('#nominee_location_url').val(url);
    };

    // Show/hide nominee address fields
    $('#different_address').on('change', function () {
        $('#nominee_address_fields').toggle(this.checked);
    });

    // Photo Preview
    $('#photo').on('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#photoPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    });

    // Load Team dropdown
    $.getJSON("php/group.php", function (data) {
        $.each(data, function (i, group) {
            $("#teamid").append(
                $("<option>")
                    .val(group.id)
                    .data("dc", group.dc_charge_calculation)
                    .data("tp", group.time_period)
                    .text(group.group_number + " - " + group.employee_name)
            );
        });
    });

    $("#teamid").on('change', function () {
        const dc = $(this).find(':selected').data('dc');
        const tp = $(this).find(':selected').data('tp');
        $('#dc_charge_calculation').val(dc);
        $('#time_period').val(tp); // <-- make sure you have <input type="hidden" id="time_period">
    });


    // Load Members
    function loadMembers() {
        $.getJSON('php/member.php', function (data) {
            let rows = '';
            $.each(data, function (i, member) {
                rows += `
                <tr>
                    <td>${member.user_name ?? ''}</td>
                    <td>${member.phone ?? ''}</td>
                    <td>${member.amount ?? ''}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning me-2 editMember" data-id="${member.id}"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger deleteMember" data-id="${member.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>`;
            });
            $('#membersTable').html(rows);
        });
    }
    loadMembers();

    // Delete (SweetAlert confirm)
    $(document).on('click', '.deleteMember', function () {
        const id = $(this).data('id');
        Swal.fire({
            title: 'Delete this member?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            $.post('php/member.php', { action: 'delete', id: id }, function (res) {
                if (res.status === 'success') {
                    Swal.fire({ icon: 'success', title: 'Deleted', text: res.message, timer: 1500, showConfirmButton: false });
                    loadMembers();
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to delete.' });
                }
            }, 'json').fail(function (xhr) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Request failed.', footer: xhr.responseText || '' });
            });
        });
    });

    // Edit
    $(document).on('click', '.editMember', function () {
        const id = $(this).data('id');
        $.getJSON('php/member.php', function (data) {
            const member = data.find(m => String(m.id) === String(id));
            if (!member) return;

            // reset & fill
            $('#memberForm')[0].reset();

            $('#user_name').val(member.user_name);
            $('#phone').val(member.phone);
            $('#phone2').val(member.phone2);
            $('#aadhar').val(member.aadhar);
            $('#city').val(member.city);
            $('#district').val(member.district);
            $('#pincode').val(member.pincode);
            $('#location_url').val(member.location_url);
            $('#leader').prop('checked', Number(member.leader) === 1);

            $('#nominee_name').val(member.nominee_name);
            $('#nominee_phone').val(member.nominee_phone);
            $('#nominee_phone2').val(member.nominee_phone2);
            $('#nominee_aadhar').val(member.nominee_aadhar);
            $('#nominee_relationship').val(member.nominee_relationship);

            if (member.nominee_city && member.nominee_city !== member.city) {
                $('#different_address').prop('checked', true).trigger('change');
                $('#nominee_city').val(member.nominee_city);
                $('#nominee_district').val(member.nominee_district);
                $('#nominee_pincode').val(member.nominee_pincode);
                $('#nominee_location_url').val(member.nominee_location_url);
            } else {
                $('#different_address').prop('checked', false).trigger('change');
            }

            $('#teamid').val(member.teamid);
            const amt = parseFloat(member.amount) || 0;
            const dcAmt = parseFloat(member.dc_amount) || 0;
            $('#dc_charge_calculation').val(amt ? (dcAmt / amt) : '');
            $('#amount').val(member.amount);
            $('#interest').val(member.interest);
            $('#verification').prop('checked', Number(member.verification) === 1);
            $('#nominee_verification').prop('checked', Number(member.nominee_verification) === 1);
            $('#photoPreview').attr('src', member.photo || '');

            // hidden fields for update
            $('#member_id').val(member.id);
            if (!$('#action_field').length) {
                $('<input>').attr({ type: 'hidden', id: 'action_field', name: 'action', value: 'update' }).appendTo('#memberForm');
            } else {
                $('#action_field').val('update');
            }

            if (member.photo) {
                $('#photoPreview').attr('src', member.photo.startsWith('uploads/')
                    ? 'php/' + member.photo
                    : member.photo);
            } else {
                $('#photoPreview').attr('src', '');
            }
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    });

    // Submit (SweetAlert feedback)
    $('#memberForm').on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            url: 'php/member.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        })
            .done(function (res) {
                if (res.status === 'success') {
                    Swal.fire({ icon: 'success', title: 'Saved', text: res.message, timer: 1500, showConfirmButton: false });
                    $('#memberForm')[0].reset();
                    $('#photoPreview').attr('src', '');
                    $('#different_address').prop('checked', false).trigger('change');
                    // keep the hidden member_id input in the DOM; just clear it
                    $('#member_id').val('');
                    $('#action_field').remove();
                    loadMembers();
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Operation failed.' });
                }
            })
            .fail(function (xhr) {
                // Helpful error display when PHP sends a non-JSON warning/notice
                Swal.fire({
                    icon: 'error',
                    title: 'Request failed',
                    text: 'Something went wrong.',
                    footer: `<pre style="white-space:pre-wrap;text-align:left">${xhr.responseText || ''}</pre>`
                });
            });
    });


});
