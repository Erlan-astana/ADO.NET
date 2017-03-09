

$(document).ready(function () {

    var employee = {};
    var api = {};
       params();
   
    window.myjquery = api;
       
    dialog1();
        
    getAllEmployees();

    // данные из база данных
    function getAllEmployees() {
       
        var where = "";
        var searchText = $('#filter').val();

        if (searchText!="" && searchText != null && searchText != undefined) {
            where = " where fio like '%" + searchText + "%'";
        } 
        
        $.ajax({
            url: 'ws.asmx/GetAllEmployees',
            dataType: "json",
            method: 'post',
            contentType: "application/json; charset=utf-8",
            data: '{"where":"'+where+'","orderBy":"' + api.sort + '"}',
            success: function (data) {

                console.log("kelgen danni", data);
                data = JSON.parse(data.d);

                var employeeTable = $('#tblEmployee ');

                employeeTable.empty();  //удаляем внутр таблицы с помощью - empty()

                api.data.length = 0;  // пустой массив

                $(data).each(function (index, emp) {


                    //добавляем в массив
                    api.data.push({
                        id: emp.ID,
                        fio: emp.fio,
                        age: emp.age,
                        adres: emp.adres,
                        gender: emp.gender


                    });

                    employeeTable.append('<tr class="sort"  indx=' + emp.ID + '> <td><input  type="checkbox" class="box"/></td><br/><td>' + emp.fio + '</td><br/><td>' + emp.age +
                      '</td><br/><td>' + emp.adres + '</td><td>' + emp.gender + '</td></tr>');

                });
            },
            error: function (err) {
                console.log("mydata=", err);

            }
        });

    }

    // ФИЛТРАЦИЯ ПОИСК ПО БАЗА ДАННЫХ 
    $('#filterbut').click(function filter() {

        var searchText = $("#filter").val();

        if (searchText == "" || searchText == null || searchText == " ") {
            alert("ошибка");
        } else {
            getAllEmployees();
        }

    });
    

    function params() {
        api.data = [];
        api.indx = 0;
        api.sort = "asc";
    }
    //  Диолаг Добавить
        function dialog1() {

        $('#dialog').dialog({
            buttons: [{ text: "ОК", click: dobavit }],
            modal: true,
            autoOpen: false,
            width: 340

        });
    }

    //Диолаг Изменить
      function dialog2() {

        $('#dialog').dialog({
            buttons: [{ text: "Сохр.изм", click: izmenit }],
            modal: true,
            autoOpen: false,
            width: 340
        });
    }

        //Создание класса selected-row

    $("#tblEmployee").on("click", "tr", function (event) {

        $("#tblEmployee tr").removeClass('selected-row');

        $(this).addClass('selected-row');
        var indx = $(this).attr("indx");
        api.indx = indx;

    });

    
    //Кнопка  Добавить

    $('#show').button().click(function () {

        $("input").prop("value", "");
        api.editMode = "add";
        dialog1();
        $('#dialog').dialog("open");
        sumtr2();

    });

    //ФНУКЦИЯ ДОБАВИТЬ
    function dobavit() {
        var fio = $("#fio").val();
        var age = $('#age').val();
        var adres = $('#adres').val();

        if (fio != "" && fio != null && fio != " " && age != "" && age != null && age != " "
           && adres != "" && adres != null && adres != " " ) 
        {
       
            employee.fio = $('#fio').val();
            employee.age = $('#age').val();
            employee.adres = $('#adres').val();
            employee.gender = $('#input-select').val();

            $.ajax({
                url: 'ws.asmx/AddEmployee',
                dataType: "json",
                method: 'post',
                data: '{emp: ' + JSON.stringify(employee) + '}',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                                    
                    data = JSON.parse(data.d);                  
                    console.log("база данных ", data);
                    if (data.ErrorMessage == "insert") {
                  
                        var newData = data.InsData;
                        console.log("newData:", newData);
                        // $(data).each(function (index, emp) { });
                        JSON2 = JSON.parse(newData);
                        console.log("JSON2:", JSON2[0].ID);
                        for (var i = 0; i < JSON2.length; i++)
                        {              
                           //добавляем в массив
                            api.data.push({
                                id: JSON2[i].ID,
                                fio: JSON2[i].fio,
                                age: JSON2[i].age,
                                adres: JSON2[i].adres,
                                gender: JSON2[i].gender})

                           
                            var employeeTable = $('#tblEmployee ');
                            employeeTable.append('<tr class="sort"  indx=' + JSON2[i].ID + '> <td><input  type="checkbox" class="box"/></td><br/><td>' + JSON2[i].fio + '</td><br/><td>' + JSON2[i].age +
                              '</td><br/><td>' + JSON2[i].adres + '</td><td>' + JSON2[i].gender + '</td></tr>');
                        }                    
                        alert("Успешно добавлено! " + data.ErrorMessage);
                    } else { alert("ошибка" + data.ErrorMessage); }
                
                },
                error: function (err) {
                    console.log("err", err);
                    err2 = JSON.parse(err.responseText); 
                    alert(err2.Message);
                }
            });                  
       
        $('#dialog').dialog("close");
        // очистка инпута,input
        $("#fio").val('');
        $('#age').val('');
        $('#adres').val('');
        }
        else {
            alert("Ошибка: заполните данные");
    }
    }
 
         

    //Кнопка УДАЛИТЬ
    $('#show3').button().click(function (event) {
        if ($("#tblEmployee tr").hasClass('selected-row')) {

            var indxId2 = $("tr.selected-row").attr("indx"); // индех аркылы ID-алу 

            var cell = $('#tblEmployee tr.selected-row');
            cell.remove();


            var indxId = parseInt(indxId2);
            //  employee.index = indxId;
            $.ajax({
                url: 'ws.asmx/delete',
                dataType: "json",
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: '{indxId: ' + indxId + '}',  // data: '{emp: ' + JSON.stringify(employee) + '}',
                success: function (data) {
                    // getAllEmployees();
                    console.log("data", data);
                    data = JSON.parse(data.d);
                    alert("удалено из таблицы");
                    console.log("база данных ", data.ErrorMessage);
                    if(data.ErrorMessage=="delete")
                    {
                        
                        alert("Успешно удалено! " );
                    }else {"ошибка"}
                    
                },
                error: function (err) {
                    console.log("err", err);
                    alert(err);
                   
                }
            });

        } else alert('выберите строку!!!');




    });


    
    //Кнопка  Изменить

    $('#show4').button().click(function () {
        if ($("#tblEmployee tr").hasClass('selected-row')) {
            dialog2();
            $('#dialog').dialog("open")
        }
        else {
            alert("Выберите строку");
        }
    });

    // ИЗМЕНИТЬ, клик два раза

    $("#tblEmployee").on("dblclick", ".selected-row", function () {

        dialog2();
        $('#dialog').dialog("open")


    });

     // ФНУКЦИЯ ИЗМЕНИТЬ
    function izmenit() {
        var fio = $("#fio").val();
        var age = $('#age').val();
        var adres = $('#adres').val();

        try //проверка на число в инпуте age 
        {
        var j = JSON.parse(age);
        var Uznattip = typeof j;  // typeof- узнаем  тип переменой
        if (fio != "" && fio != null && fio != " " && age != "" && age != null && age != " "
           && adres != "" && adres != null && adres != " " && age != "" && age != null && age != " "
            )
        {                     
            console.log(age, Uznattip, j);

            var index2 = $("tr.selected-row").attr("indx");
            employee.ID = index2;  console.log("ID update:"  +index2);
            employee.fio = $('#fio').val();
            employee.age = $('#age').val();
            employee.adres = $('#adres').val();
            employee.gender = $('#input-select').val();

            $.ajax({
                url: 'ws.asmx/Update',
                method: 'post',
                data: '{emp: ' + JSON.stringify(employee) + '}',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    data = JSON.parse(data.d);
                    if (data.ErrorMessage == "Update") {
                        data2 = JSON.parse(data.idupdate);
                        console.log(data, 'data.idupdate' , data2);
                        $(data2).each(function (index, emp) {
                            //добавляем в массив
                            api.data.push({
                                id: emp.ID,
                                fio: emp.fio,
                                age: emp.age,
                                adres: emp.adres,
                                gender: emp.gender   });                                                     
                                                         
                            $('#tblEmployee tr.selected-row').replaceWith('<tr class="sort"  indx=' + emp.ID + '> <td><input  type="checkbox" class="box"/></td><br/><td>' + emp.fio + '</td><br/><td>' + emp.age +
                              '</td><br/><td>' + emp.adres + '</td><td>' + emp.gender + '</td></tr>');
                        });
                        alert("Изменено в Базе данных" + data.ErrorMessage);
                      
                    } else {
                        alert("Ошибка " + data.ErrorMessage);

                    }

                },
                error: function (err) {
                    console.log("err", err);
                    alert(err);
                }
            });

            $('#dialog').dialog("close");

        } else {
            alert("Ошибка: заполните данные");
        }
            } catch (e) {
                alert('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);

            }
    }

    
    

    //Кнопка Сортировка
    $('#show2').button().click(function () {
        if (api.sort == "asc") {
            api.sort = "desc";
        }

        else api.sort = "asc";

        getAllEmployees();

    });

    //ЧЕКБОКС
    $('#thinput').click(function poisk() {
        var flag = this.checked;
        $('#tblEmployee').find(".box").prop("checked", flag);
    });


    //Количество строк в таблице 

    function sumtr() {
        var sum = $("#tblEmployee").find('.sort');
        var sum2 = sum.length;
        $("#sumtr").html("Количество строк в таблице - " + sum2);
        $("#sumtr").css('color', 'green');
    }

    //Количество строк в таблице 
    function sumtr2() {
        var sum = $("#tblEmployee").find('.sort');
        var sum2 = sum.length + 1;
        $("#sumtr").html("Количество строк в таблице - " + sum2);
        $("#sumtr").css('color', 'green');
    }
    $("#sumtr").click(function () {
        sumtr();
    });



        var a = [];
    //ФНУКЦИЯ СОРТИРОВКА
    function sort() {
    //    var employeeTable = $('#tblEmployee ');
    //    employeeTable.empty();
    //    var byName = api.data.slice(0);

    //    byName.sort(function (a, b) {
    //        var x = a.fio.toLowerCase();
    //        var y = b.fio.toLowerCase();
    //        return x < y ? -1 : x > y ? 1 : 0;
    //    });




    //    for (var i = 0; i < byName.length; i++) {
    //        //byName[i].id
    //        $('<tr class="sort"  indx=' + byName[i].id + '> <td><input  type="checkbox" class="box"/></td><br/><td>' + byName[i].fio + '</td><br/><td>' + byName[i].age +
    //            '</td><br/><td>' + byName[i].adres + '</td><td>' + byName[i].gender + '</td></tr>').appendTo($('#tblEmployee'));

    //        console.log(employee);
    //    }
    }

       
    //Филтер, Кнопка назад

    $("#otmena").click(function () {
        $('#filter').val('');

        getAllEmployees();

    });

      
    
    //select sorting
    var s = [];
    $('#select').change(function () {
        $(".sort").show();
        $("#tblEmployee tr").removeClass('NOHide');

        var f1 = $("#select").val();
        if (f1 != "" || f1 != null || f1 != " ") {
            var ss = f1;
            for (var i = 0; i < api.data.length; i++) {
                if (api.data[i].gender == ss) {
                    s.push(api.data[i].id);
                }
            }

        } else { alert("ошибка"); }

        select();
    });

    function select() {
        for (i = 0; i < s.length; i++) {
            //console.log(s[i]);
            $('[indx^="' + s[i] + '"]').addClass("NOHide");
        }
        if (s.length != 0) {

            $("tr:eq(0)").addClass("NOHide");
            $("tr:not(.NOHide)").hide();

        } else alert('совпадение не найдено');

        s.splice(0, s.length);
    }


    $("#select-otmena").click(function () {
        $(".sort").show();
        $("#tblEmployee tr").removeClass('NOHide');

    });


    console.log(window);






});
