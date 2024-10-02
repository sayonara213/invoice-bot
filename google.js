const { sheet, spreadsheetId } = require("./config.js");

const findLinkCellForUser = async (userName) => {
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId,
    range: "August!A1:Z1000",
  });

  const [_, ...rows] = res.data.values;

  const processedRows = rows.map((row, index) => ({
    accountName: row[0],
    salesName: row[1],
    devEmail: row[2],
    devName: row[3],
    devTelegram: row[4],
    salary: row[5],
    chargeEmail: row[6],
    chargeName: row[7],
    chargeAddress: row[8],
    rowNumber: index + 1,
  }));

  console.log(processedRows);

  const userRow = processedRows.find(
    (row) => row.devTelegram?.substring(1) === userName
  );

  if (!userRow) return "no-user";

  return userRow;
};

async function findRowByRecord(searchValue) {
  try {
    let containsEmpty = false;

    // Loop through the rows to find the row that contains the searchValue
    const userRow = await findLinkCellForUser(searchValue);

    if (userRow === "no-user") {
      return "no-user";
    }

    //Check if any cell is empty
    Object.keys(userRow).forEach((field) => {
      if (userRow[field] === "") {
        console.log(userRow[field]);
        containsEmpty = true;
      }
    });

    if (containsEmpty) {
      return null;
    }

    if (userRow) {
      console.log("Found row:", JSON.stringify(userRow, null, 2));
      return `${JSON.stringify(userRow, null, 2)}`;
    } else {
      console.log("No matching record found.");
      return null;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

async function updateRowByRecord(searchValue, updateValue) {
  try {
    const userRow = await findLinkCellForUser(searchValue);

    const res = await sheet.spreadsheets.values.update({
      spreadsheetId,
      range: `August!J${userRow.rowNumber + 1}`, // Example: 'Sheet1!A1'
      valueInputOption: "USER_ENTERED", // or 'RAW'
      resource: {
        values: [[updateValue]],
      },
    });

    return res;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

module.exports = {
  findRowByRecord,
  updateRowByRecord,
};
