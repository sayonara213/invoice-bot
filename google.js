import { sheet, spreadsheetId } from "./config.js"

const findLinkCellForUser = async (userName) => {
    const res = await sheet.spreadsheets.values.get({
        spreadsheetId,
        range: "Аркуш1!A1:Z1000",
      });
  
      const [_, ...rows] = res.data.values;

      const processedRows = rows.map((row, index) => ({
        devName: row[0],
        devEmail: row[1],
        salary: row[2],
        chargeName: row[3],
        chargeEmail: row[4],
        chargeAddress: row[5],
        devTelegram: row[6],
        rowNumber: index + 1
      }))

      const userRow = processedRows.find((row) => row.devTelegram === userName);

      return userRow;
}

export async function findRowByRecord(searchValue) {
    try {
      let containsEmpty = false;
  
      // Loop through the rows to find the row that contains the searchValue
      const userRow = await findLinkCellForUser(searchValue);

      //Check if any cell is empty
      Object.keys(userRow).forEach(field => {
          if (userRow[field] === "") {
            console.log(userRow[field]);
              containsEmpty = true;
          }
      });

      if (containsEmpty) {
        return null;
      }

  
      if (userRow) {
        console.log('Found row:', JSON.stringify(userRow, null, 2));
        return  `${JSON.stringify(userRow, null, 2)}`;
      } else {
        console.log('No matching record found.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  } 

  export async function updateRowByRecord(searchValue, updateValue) {
    try {
        const userRow = await findLinkCellForUser(searchValue);
      
        const res = await sheet.spreadsheets.values.update({
            spreadsheetId,
            range: `Аркуш1!H${userRow.rowNumber + 1}`, // Example: 'Sheet1!A1'
            valueInputOption: 'USER_ENTERED', // or 'RAW'
            resource: {
              values: [[updateValue]],
            },
          });
     
        return res;

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }