<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Member Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
    <div class="container py-5">
        <h2 class="mb-4">Member Details</h2>
        <div id="memberCard" class="card shadow p-3"></div>

        <!-- Back + Edit -->
        <div class="d-flex justify-content-between mt-3">
            <a href="dashboard.php" class="btn btn-secondary">⬅ Back to Dashboard</a>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#paymentModal">
                Edit Payment
            </button>
        </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Payment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="paymentForm">
                        <input type="hidden" name="member_id" id="member_id">

                        <div class="mb-3">
                            <label class="form-label">Member Name</label>
                            <input type="text" class="form-control" id="member_name" readonly>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input type="date" class="form-control" name="paid_date" required>
                        </div>

                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="is_paid" name="is_paid">
                            <label class="form-check-label" for="is_paid">Paid</label>
                        </div>

                        <div class="mb-3 paid-fields" style="display:none;">
                            <label class="form-label">Paid Amount</label>
                            <input type="number" class="form-control" name="paid_amount" id="paid_amount" step="0.01">
                        </div>

                        <div class="mb-3 paid-fields" style="display:none;">
                            <label class="form-label">Payment Mode</label>
                            <select class="form-select" name="payment_mode">
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-success">Save Payment</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const urlParams = new URLSearchParams(window.location.search);
            const memberId = urlParams.get("id");

            if (!memberId) {
                document.getElementById("memberCard").innerHTML =
                    "<div class='alert alert-danger'>Missing member ID</div>";
                return;
            }

            // Load member details
            fetch(`php/getMemberDetails.php?id=${memberId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById("memberCard").innerHTML =
                            `<div class='alert alert-danger'>${data.error}</div>`;
                        return;
                    }

                    // Fill card
                    document.getElementById("memberCard").innerHTML = `
                <h4>${data.user_name}</h4>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Nominee:</strong> ${data.nominee_name}</p>
                <p><strong>Loan Amount:</strong> ₹${data.amount}</p>
                <p><strong>DC Charge:</strong> ₹${data.dc_charge}</p>
                <p><strong>Pending Amount:</strong> <span class="pending-amount">₹${data.pending_amount}</span></p>
            `;

                    // Pre-fill modal
                    document.getElementById("member_id").value = data.id;
                    document.getElementById("member_name").value = data.user_name;
                })
                .catch(err => {
                    document.getElementById("memberCard").innerHTML =
                        "<div class='alert alert-danger'>Error loading member details</div>";
                    console.error("Error loading member details:", err);
                });

            // Toggle paid fields
            document.getElementById("is_paid").addEventListener("change", function() {
                document.querySelectorAll(".paid-fields").forEach(el => {
                    el.style.display = this.checked ? "block" : "none";
                });
            });

            // Save form
            document.getElementById("paymentForm").addEventListener("submit", function(e) {
                e.preventDefault();

                fetch("php/savePayment.php", {
                        method: "POST",
                        body: new FormData(this)
                    })
                    .then(res => res.json())
                    .then(resp => {
                        if (resp.success) {
                            
                            Swal.fire({
                                icon: "success",
                                title: "Payment Saved",
                                text: "The payment was recorded successfully!",
                                confirmButtonColor: "#198754"
                            }).then(() => {
                                
                                document.querySelector("#memberCard .pending-amount").textContent = "₹" + resp.new_pending;

                                
                                const modal = bootstrap.Modal.getInstance(document.getElementById("paymentModal"));
                                modal.hide();
                            });
                        } else {
                            
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: resp.error || "Something went wrong!"
                            });
                        }
                    })
                    .catch(err => {
                        console.error("Save error:", err);
                        Swal.fire({
                            icon: "error",
                            title: "Server Error",
                            text: "Could not save payment. Please try again."
                        });
                    });
            });
        });
    </script>


</body>

</html>