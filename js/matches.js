let possibleIds = $('.possible-ids')[0];
$(possibleIds).on('change', function(e) {
    if (stage.shapes[stage.shapeSelected]) {
        let matchsOfShape = [];
        let unmatchsOfShape = [];
        $(possibleIds).find('li').each((index, option) => {
            let selected = $(option).hasClass('selected');
            option = Number($(option).find('.text').text().trim());
            if (selected) matchsOfShape.push(option);
            else unmatchsOfShape.push(option);
        })
        for (let i = 0; i < matchsOfShape.length; i++) {
            if (!stage.shapes[stage.shapeSelected].matchId.includes(matchsOfShape[i]))
                stage.shapes[stage.shapeSelected].matchId.push(matchsOfShape[i]);
        }

        for (let i = 0; i < unmatchsOfShape.length; i++) {
            if (stage.shapes[stage.shapeSelected].matchId.includes(unmatchsOfShape[i])) {
                stage.shapes[stage.shapeSelected].matchId = stage.shapes[stage.shapeSelected].matchId.filter((id) => unmatchsOfShape[i] != id);
            }
        }
        console.log('matchs', stage.shapes[stage.shapeSelected].matchId)
    };
});