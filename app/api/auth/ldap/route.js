import ldap from "ldapjs";

const LDAP_URL = "my-server";
const BASE_DN = "dc=example,dc=com";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = ldap.createClient({
    url: LDAP_URL,
  });

  return new Promise((resolve) => {
    // Step 1: Search user by email
    const opts = {
      filter: `(mail=${email})`,
      scope: "sub",
      attributes: ["dn"],
    };

    client.search(BASE_DN, opts, (err, res) => {
      if (err) {
        resolve(new Response(JSON.stringify({ success: false }), { status: 500 }));
        return;
      }

      let userDN = null;

      res.on("searchEntry", (entry) => {
        userDN = entry.objectName;
      });

      res.on("end", () => {
        if (!userDN) {
          resolve(
            new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 })
          );
          return;
        }


        client.bind(userDN, password, (err) => {
          if (err) {
            resolve(
              new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 })
            );
          } else {
            resolve(
              new Response(JSON.stringify({ success: true, message: "Login success" }), { status: 200 })
            );
          }

          client.unbind();
        });
      });
    });
  });
}