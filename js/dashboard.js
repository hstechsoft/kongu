document.addEventListener("DOMContentLoaded", function () {
    fetch("php/dashboard.php")
        .then(res => res.json())
        .then(groups => {
            const container = document.getElementById("groupsContainer");
            container.innerHTML = "";

            groups.forEach(g => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${g.id}</td>
                    <td>Group ${g.group_number}</td>
                    <td>${g.leader_name ?? "No leader"}</td>
                    <td>${g.location ?? "N/A"}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-btn" data-id="${g.id}">
                            View Members
                        </button>
                    </td>
                `;

                // "View Members" button
                row.querySelector(".view-btn").addEventListener("click", function () {
                    fetch(`php/getMembers.php?groupid=${g.id}`)
                        .then(res => res.json())
                        .then(members => {
                            const membersContainer = document.getElementById("membersContainer");
                            membersContainer.innerHTML = "";

                            members.forEach(m => {
                                const tr = document.createElement("tr");
                                tr.style.cursor = "pointer"; // make it look clickable
                                tr.innerHTML = `
                                    <td>${m.id } </td>
                                    <td>${m.user_name}( ${m.phone}) - ${m.nominee_name}( ${m.phone2})</td>
                                     <td>${m.leader == 1 ? "✅" : ""}</td>
                                  <td>${m.total_paid}</td>
                                  <td>${m.paid_date ? new Date(m.paid_date).toLocaleDateString() : 'N/A'}</td>
                                   
                                `;

                                // Redirect to employee details page
                                tr.addEventListener("click", function () {
                                    window.location.href = `memberDetails.php?id=${m.id}`;
                                });

                                membersContainer.appendChild(tr);
                            });

                            // Show modal
                            const modal = new bootstrap.Modal(document.getElementById('membersModal'));
                            modal.show();
                        })
                        .catch(err => console.error("Error loading members:", err));
                });

                container.appendChild(row);
            });
        })
        .catch(err => console.error("Error loading groups:", err));
});
