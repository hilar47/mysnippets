$(document).ready(function() {

    //Survey Timeline
    $('.survey-slider').slick({
        centerMode: true,
        centerPadding: '250px',
        slidesToShow: 1,
        infinite: false,
        draggable: false,
        dots: true,
        responsive: [{
            breakpoint: 1001,
            settings: {
                centerMode: false,
                centerPadding: '10px',
                slidesToShow: 1
            }
        }]
    });

    //Activate dots on click of button or the dots
    $(".slick-dots li").click(function() {
        $(this).prevAll('li').addClass('slick-active')
    });
    $(".slick-arrow").click(function() {
        $('.slick-active').prevAll('.slick-dots li').addClass('slick-active')
    });



    //reset questions slider on click of backdrop or close button
    $("#surveyModalQuestions").click(function() {
        $('.survey-slider').slick('slickGoTo', 0);
    });

    //avoid event bubbling on child elements of question modal
    $("#surveyModalQuestions .modal-dialog").click(function(e) {
        e.stopPropagation();
    });

    //close the surveyModalQuestions modal
    $("#surveyModalQuestions .close").click(function(e) {
        $("#surveyModalQuestions").modal('hide');
        $('.survey-slider').slick('slickGoTo', 0);
    });

    //on click of 5th question call the last modal summary
    $(".slick-next").click(function() {
        if ($("#slick-slide-control05").parent().hasClass("slick-active")) {
            //reset slider
            setTimeout(function() {
                $('.survey-slider').slick('slickGoTo', 0);
            }, 500);
            //Calculate Score
            score_calculator();
            // $(this).attr("data-dismiss", "modal");
            // $(this).attr("data-toggle", "modal");
            // $(this).attr("data-target", "#surveyModalSummary");
            $("#surveyModalQuestions").modal('hide');
            $("#surveyModalSummary").modal('show');

        }
    });

    //add extra span after the dots
    $(".slick-dots button").append("<span></span>");

    //began survey again
    $(".begin-surey-again").click(function() {
        $("#surveyModalSummary").modal('hide');
        $("#surveyModalQuestions").modal('show');
    });
});



//Survey Quiz
$(".single_question .options li").on('click', function() {

    // Save the question of the clicked option 
    question = $(this).parents('.single_question');

    // Remove If Another option is already selected
    question.find('.selected').removeClass('selected');

    // Add selected class to the clicked li
    $(this).addClass('selected');

    // selected option value
    selected_answer_value = $(this).attr("value");

    //display the question
    question_text = $(question).find("h3").html();

    //display the option selected using the <b> tag as selector
    correct_answer_text = $(this).find("b").html();


    check = question.attr('data-question-id');

    // Write the result of the question
    if ($('.answers').find("#" + check).length == 0) {
        result = "<p>" + question_text + "</p><p class='answer' id =" + check + ">" + correct_answer_text + "<input class='score' type='text' value='" + selected_answer_value + "' /></p>";
        $('.answers').append(result);
    } else {
        correct_answer_text = correct_answer_text + "<input class='score' readonly type='text' value='" + selected_answer_value + "' />";
        $('.answers').find("#" + check).html(correct_answer_text);
    }

});

//Calculate Score
function score_calculator() {
    score = 0;
    $('.answers .score').each(function() {
        score += Number(this.value);
    });

    $('.correct_answers').html(score);
}

/***************** Print Summary ***************/

//create a new jsPDF function 
// var doc = new jsPDF();

// //properties
// // doc.setTextColor(255, 0, 0);
// // doc.text(20, 20, '');

// //store data to the temporary div
// var specialElementHandlers = {
//     '#printSummary': function(element, renderer) {
//         return true;
//     }
// };



// //on click of the btn save the pdf
// $('.download-summary').click(function() {
//     margins = {
//         top: 80,
//         bottom: 60,
//         left: 40,
//         width: 522
//     };

//     doc.fromHTML($('.results').html(), 15, 15, {
//         'width': 170,
//         'elementHandlers': specialElementHandlers
//     });
//     doc.save('survey.pdf');
// });


//function to print pdf
function ExportPdf() {
    kendo.drawing
        //content to print
        .drawDOM("#results", {
            forcePageBreak: ".page-break",
            paperSize: "A4",
            margin: {
                top: "1cm",
                bottom: "1cm"
            },
            scale: 0.8,
            height: 500,
            template: $("#page-template").html()
                //keepTogether: ".prevent-split"
        })
        .then(function(group) {
            //PDF name comes here
            kendo.drawing.pdf.saveAs(group, "Exported_Itinerary.pdf")
        });
}