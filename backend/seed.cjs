const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://postgres:Krishna@7824@localhost:5432/odoo_db"
});

async function runSeed() {
  try {
    await client.connect();

    // 1. Seed Contacts
    await client.query(`
      INSERT INTO contacts (name, email, type) 
      VALUES ('Azure Interior', 'info@azure.com', 'customer'), 
             ('Deco Addict', 'sales@decoaddict.com', 'vendor') 
      ON CONFLICT DO NOTHING;
    `);
    console.log("✔ Contacts seeded successfully!");

    // 2. Seed Default Accounts matching schema (account_name, account_type)
    const debitAccRes = await client.query(`
      INSERT INTO chart_of_accounts (account_name, account_type) 
      VALUES ('Default Debit Account', 'asset') 
      RETURNING id;
    `);
    const creditAccRes = await client.query(`
      INSERT INTO chart_of_accounts (account_name, account_type) 
      VALUES ('Default Credit Account', 'liability') 
      RETURNING id;
    `);

    const debitId = debitAccRes.rows[0].id;
    const creditId = creditAccRes.rows[0].id;

    // 3. Seed Journals referencing valid account IDs
    await client.query(`
      INSERT INTO journals (journal_name, journal_type, default_debit_account_id, default_credit_account_id) 
      VALUES ('Customer Invoices', 'sales', $1, $2), 
             ('Vendor Bills', 'purchase', $1, $2),
             ('Bank Account', 'bank', $1, $2),
             ('Cash', 'cash', $1, $2)
      ON CONFLICT DO NOTHING;
    `, [debitId, creditId]);

    console.log("✔ Chart of Accounts and Journals seeded successfully!");

  } catch (err) {
    console.error("Seeding Error:", err.message);
  } finally {
    await client.end();
  }
}

runSeed();