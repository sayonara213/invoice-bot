const salaryPrettify = (salary) => {
    return `${salary}`
}

export const handleGetMessage = (userData) => {
    return `Привіт! 
Надсилаю тобі приклад інвойсу та дані за якими тобі потрібно буде заповнити його для отримання винагороди.
https://create.onlineinvoices.com/templates/blank-invoice-template

Приклад: https://drive.google.com/file/d/17DoPKhVZgd3OeKWFsqL99gSop9o4v0BO/view?usp=sharing

Кому: ${userData.devEmail}  ${userData.devName}  $${parseInt(userData.salary)}
Звідки: Full name
${userData.chargeName}
Email
${userData.chargeEmail}
Address
${userData.chargeAddress}

Валюта долар, це можна змінити у лівому верхньому куті, суми  заповнюй як хочеш, головне аби вийшла та сума яку ти маєш отримати. Щодо номера інвойсу, попрошу тебе глянути за останні пів року скільки надходило і чи взагалі були нагороди з даного пейоніру, якщо ні - №1, якщо, припустимо, 3 то відповідно - №4. 

Після того,як ти створив інвойс тобі потрібно в пейонірі зробити ріквест, ось надсилаю відео інструкцію як це зробити, насправді це все дуже просто) Не забудьте прикріпити інвойс!
https://www.loom.com/share/2548313eccbf4073b0945da44b49a321?sid=af51abf1-b187-4dea-a9bc-a45bfd3c2bbe
https://www.loom.com/share/ae0a53cf37894804b2d41ba3095529d4?sid=a8c9fe3f-03e1-472a-be2e-b525342988d2

Коли зробиш ріквест скинь сюди, будь ласка, лінку. 

дякую:)`
}

export const isPayoneerLink = (link) => {
    try {
      const url = new URL(link);
  
      // Check if the link is from 'link.payoneer.com' and the path starts with '/Token'
      if (url.host === 'link.payoneer.com' && url.pathname === '/Token') {
        return true;
      }
  
      return false;
    } catch (e) {
      // If the link is not a valid URL, return false
      return false;
    }
  }