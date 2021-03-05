import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
	},
	paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default function AddBook () {
	const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
	const [skipped, setSkipped] = React.useState(new Set());
	const [data, setData]= React.useState([]);
	const [subGenre, setSubGenre]= React.useState({});
	const [addNew, setAddNew]= React.useState(false);
	const [active, setActive]= React.useState(false);
	const [stepValue, setStepValue]= React.useState({});
	const [description, setDescription]= React.useState(false);
	const [subGenreName, setSubGenreName]= React.useState('');
	const [getTradeSteps, setGetTradeSteps]= React.useState([]);
	const [formSubmitted, setFormSubmitted]= React.useState(false);
  const [addNewSubgenre, setAddNewSubgenre]= React.useState('');
  const [title, setTitle]= React.useState('');
	const [author, setAuthor]= React.useState('Author');
	const [isbn, setIsbn]= React.useState('');
	const [publisher, setPublisher]= React.useState('Publisher');
	const [datePublished, setDatePublished]= React.useState(new Date());
	const [noOfPages, setNoOfPages]= React.useState('');
	const [edition, setEdition]= React.useState('');
	const [format, setFormat]= React.useState('Format');
	const [editionLanguage, setEditionLanguage]= React.useState('Edition Language');
	const [inputDescription, setInputDescription]= React.useState('');

  const getData = () => {
    fetch('data.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
		.then(function(response){
			return response.json();
		})
		.then(function(myJson) {
			setData(myJson.genres)
		});
	}
	
  useEffect(() => {
    getData();
    getSteps();
  }, [])
	
	const getSteps = () => {
		setGetTradeSteps(['Genre', 'Subgenere']);
	}
		
	const totalSteps = () => {
		return getTradeSteps.length;
  };
	
	const getStepContent = (step) => {
		switch (step) {
			case 0:
			return step1Content(data, step);
			case 1:
			return step1Content(subGenre, step);
			case 2:
			return addNew ? addNewSubgenreForm() : informationForm();
			case 3:
      return informationForm();
			default:
			return 'Unknown step';
		}
  }

	const genreClicked = (getGenre, addNewSubGenre, step) => {
    setAddNewSubgenre(addNewSubGenre);
    if(step === 0) {
      setSubGenre(getGenre);
    } else if (step === 1) {
      if(addNewSubGenre) {
        if(getTradeSteps.length >= 3) {
          getTradeSteps.splice(2)
          setGetTradeSteps(getTradeSteps);
        }
        setGetTradeSteps([ ...getTradeSteps, 'Add new Subgenerie', 'Information']);
        setAddNew(true);
      } else {
        setAddNew(false);
        if(getTradeSteps.length >= 3) {
          getTradeSteps.splice(2)
          setGetTradeSteps(getTradeSteps);
        }
        setGetTradeSteps([ ...getTradeSteps, 'Information']);
        setStepValue(getGenre);
        getStepContent(3);
      }
    }
	}

	const step1Content = (getVal, getStep) => {
    if(getStep === 1) {
      var actualValue = getVal.subgenres;
    } else {
      var actualValue = getVal;
    }
		if(actualValue) {
			return <Grid container spacing={3}>
				{actualValue.map((value, index) =>
          <Grid className={`cursor-pointer`} key={index} item xs={6} sm={3} onClick={() => genreClicked(value, false, getStep)}>
            <Paper className={`${classes.paper} genres ${(value.id === subGenre.id) ? 'active' : '' }`}>{value.name}</Paper>
          </Grid>
				)}
				{getStep === 1 && 
					<Grid className='cursor-pointer' key='step_4' item xs={6} sm={3} onClick={() => genreClicked(null, true, getStep)}>
						<Paper className={`${classes.paper} genres ${((getStep === 1) && addNewSubgenre) ? 'active' : '' }`}>Add new</Paper>
					</Grid>
				}
			</Grid>
		}
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const handleInputChange = (event) => {   
    setDescription(event.target.checked);
  }

  const addNewSubgenreForm = () => {
		return <div className= 'd-block'>
      <form className= 'd-block' onSubmit={handleSubmit} >
        <div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Subgenre Name"
            value={subGenreName}
            onInput={ e => setSubGenreName(e.target.value)}
          />
        </div>
        <div className='w-100 text-left text-color'>
          <Checkbox
            label='Description is required for this Subgenre.'
            value='Subgenre Name'
            onChange={handleInputChange}
            checked={description}
          />
          <label>Description is required for this Subgenre.</label>
        </div>
      </form>
    </div>
  }
  
  const handleChange = (event, valueType) => {
    switch (valueType) {
			case 'Author':
			return setAuthor(event.target.value);
			case 'Publisher':
			return setPublisher(event.target.value);
			case 'Format':
			return setFormat(event.target.value);
			case 'Language':
      return setEditionLanguage(event.target.value);
      case 'Date Published':
			return setDatePublished(event.target.value);
		}
  };

	const informationForm = () => {
		return <div>
      <form id="information-form" className={classes.container} onSubmit={handleSubmit} >
        <div className="pt-4 text-left fields">
          <span>Book Title</span>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Book title"
            value={title}
            required
            onInput={ e => setTitle(e.target.value)}
          />
        </div>

        <div className="pt-4 text-left fields">
          <span id="demo-simple-select-outlined-label">Author</span>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            placeholder="Author"
            value={author}
            onChange={(evnt) => handleChange(evnt, 'Author')}
            label="Author"
            variant="outlined"
          >
            <MenuItem value="Author">
              <em>Author</em>
            </MenuItem>
            <MenuItem value={'Author 1'}>Author 1</MenuItem>
            <MenuItem value={'Author 2'}>Author 2</MenuItem>
            <MenuItem value={'Author 3'}>Author 3</MenuItem>
          </Select>
        </div>

        <div className="pt-4 text-left fields">
          <span>ISBN</span>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="ISBN"
            value={isbn}
            onInput={ e => setIsbn(e.target.value)}
          />
        </div>

        <div className="pt-4 text-left fields">
          <span id="demo-simple-select-outlined-label">Publisher</span>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            placeholder="Publisher"
            value={publisher}
            onChange={(evnt) => handleChange(evnt, 'Publisher')}
            label="Publisher"
            variant="outlined"
          >
            <MenuItem value="Publisher">
              <em>Publisher</em>
            </MenuItem>
            <MenuItem value={'Publisher 1'}>Publisher 1</MenuItem>
            <MenuItem value={'Publisher 2'}>Publisher 2</MenuItem>
            <MenuItem value={'Publisher 3'}>Publisher 3</MenuItem>
          </Select>
        </div>

        <div className="pt-4 text-left fields d-block">
          <div><span id="demo-simple-select-outlined-label">Date Published</span></div>
          <div>
            <TextField
              id="date"
              type="date"
              variant="outlined"
              value={datePublished}
              onChange={(evnt) => handleChange(evnt, 'Date Published')}
              defaultValue={`${new Date()}`}
              className={`${classes.textField} noOfPages`}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>

        <div className="pt-4 text-left fields d-block">
          <div><span>No of Pages</span></div>
          <div><TextField
            className='noOfPages'
            id="outlined-basic"
            variant="outlined"
            placeholder="No of Pages"
            value={noOfPages}
            onInput={ e => setNoOfPages(e.target.value)}
          /></div>
        </div>

        <div className="pt-4 text-left fields d-block">
          <div><span id="demo-simple-select-outlined-label">Format</span></div>
          <div><Select
            className='noOfPages'
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            placeholder="Format"
            value={format}
            onChange={(evnt) => handleChange(evnt, 'Format')}
            label="Format"
            variant="outlined"
          >
            <MenuItem value="Format">
              <em>Format</em>
            </MenuItem>
            <MenuItem value={'Format 1'}>Format 1</MenuItem>
            <MenuItem value={'Format 2'}>Format 2</MenuItem>
            <MenuItem value={'Format 3'}>Format 3</MenuItem>
          </Select></div>
        </div>

        <div className="pt-4 text-left fields d-flex w-100">
          <div className='d-block w-50 pr-3'>
            <div><span>Edition</span></div>
            <div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Edition"
                value={edition}
                onInput={ e => setEdition(e.target.value)}
              />
            </div>
          </div>
          <div className='d-block w-50'>
            <div><span id="demo-simple-select-outlined-label">Edition Language</span></div>
            <div>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                placeholder="Edition Language"
                value={editionLanguage}
                onChange={(evnt) => handleChange(evnt, 'Language')}
                label="Edition Language"
                variant="outlined"
              >
                <MenuItem value="Edition Language">
                  <em>Edition Language</em>
                </MenuItem>
                <MenuItem value={'Language 1'}>Language 1</MenuItem>
                <MenuItem value={'Language 2'}>Language 2</MenuItem>
                <MenuItem value={'Language 3'}>Language 3</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 text-left fields">
        </div>

        {description && <div className="pt-4 text-left fields">
          <span id="demo-simple-select-outlined-label">Description</span>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Description"
            value={inputDescription}
            onInput={ e => setInputDescription(e.target.value)}
            multiline
            rows={2}
            rowsMax={4}
          />
        </div>}
      </form>
    </div>
	}

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - skippedSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? getTradeSteps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const addInformationForm = (event) => {
    var formData = [];
    formData.push({
      title: title,
      author: author,
      isbn: isbn,
      publisher: publisher,
      noOfPages: noOfPages,
      format: format,
      edition: edition,
      description: description
    });
    console.log('This is the form Data', formData);
    setFormSubmitted(true);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const resetEverything = () => {
    setFormSubmitted(false);
    setActiveStep(0);
    setGetTradeSteps(['Genre', 'Subgenere']);
    setDescription(false);
	  setSubGenreName('');
	  setFormSubmitted(false);
    setTitle('');
	  setAuthor('Author');
	  setIsbn('');
	  setPublisher('Publisher');
	  setNoOfPages('');
	  setEdition('');
	  setFormat('Format');
	  setEditionLanguage('Edition Language');
	  setInputDescription('');
  }

  function isStepComplete(step) {
    return completed.has(step);
	}
	
	return (
		<div className={`${classes.root}`}>
      {formSubmitted ? (
          <div className='d-block'>
            <div><span>Book Added Successfully</span></div>
            <div className='pt-4'>
              <Button color="default" variant="contained" onClick={resetEverything}>Add another Book</Button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className='text-left'>Add book - New book</h4>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}>
              {getTradeSteps.map((label, index) => {
                const stepProps = {};
                const buttonProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepButton
                      onClick={handleStep(index)}
                      completed={isStepComplete(index)}
                      {...buttonProps}
                    >
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div className='text-right pt-4'>
                  <Button
                    disabled={activeStep === 0}
                    variant="contained"
                    color="default"
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  
                  {((getTradeSteps.length === 2 && activeStep === 0) || (getTradeSteps.length === 4 && activeStep === 2) || 
                  ((getTradeSteps.length === 3 || getTradeSteps.length === 4) && activeStep === 1) ||
                  (getTradeSteps.length === 2 && activeStep === 1) || 
                  (getTradeSteps.length === 3 && activeStep === 0) ||
                  (getTradeSteps.length === 4 && activeStep === 0)) &&
                    <Button
                      disabled={!subGenre.subgenres}
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </Button>
                  }
                  {((getTradeSteps.length === 3 && activeStep === 2) || (getTradeSteps.length === 4 && activeStep === 3)) &&
                    <Button
                      disabled={!title}
                      type="submit"
                      variant="contained"
                      color="primary"
                      form='information-form'
                      onClick={addInformationForm}
                      className={classes.button}
                    >
                      Add
                    </Button>
                  }
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );    
}