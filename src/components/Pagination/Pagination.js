import React, { Component } from "react";
import { store } from "../../store/configureStore";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setPage } from "../../actions/setPage";
import "./Pagination.scss";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
};

class Pagination extends Component {
    constructor(props) {
        super(props);
        const { totalRecords = null, pageNeighbours = 0 } = props;
        this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;
        this.pageNeighbours =
            typeof pageNeighbours === "number"
                ? Math.max(0, Math.min(pageNeighbours, 2))
                : 0;

        this.totalPages = 992;
        // this.state = { currentPage: 1 };
    }

    // componentDidMount() {
    //     this.gotoPage(1);
    // }

    changePage(page) {
        return new Promise(resolve => {
            store.dispatch(setPage(page));
            resolve(true);
        });
    }

    gotoPage = page => {
        const { onPageChanged = f => f } = this.props;

        const currentPage = Math.max(0, Math.min(page, this.totalPages));

        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            totalRecords: this.totalRecords
        };

        this.changePage(currentPage).then(e => {
            if (e) {
                onPageChanged(paginationData);
            }
        });

        // this.setState({ currentPage }, () => onPageChanged(paginationData));
    };

    handleClick = (page, evt) => {
        evt.preventDefault();
        console.log("page", page);
        this.gotoPage(page);
    };

    handleMoveLeft = evt => {
        evt.preventDefault();
        this.gotoPage(this.props.page - this.pageNeighbours * 2 - 1);
    };

    handleMoveRight = evt => {
        evt.preventDefault();
        this.gotoPage(this.props.page + this.pageNeighbours * 2 + 1);
    };

    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.props.page;
        const pageNeighbours = this.pageNeighbours;
        const totalNumbers = this.pageNeighbours * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = currentPage - pageNeighbours;
            const rightBound = currentPage + pageNeighbours;
            const beforeLastPage = totalPages - 1;

            const startPage = leftBound > 2 ? leftBound : 2;
            const endPage =
                rightBound < beforeLastPage ? rightBound : beforeLastPage;

            pages = range(startPage, endPage);

            const pagesCount = pages.length;
            const singleSpillOffset = totalNumbers - pagesCount - 1;

            const leftSpill = startPage > 2;
            const rightSpill = endPage < beforeLastPage;

            const leftSpillPage = LEFT_PAGE;
            const rightSpillPage = RIGHT_PAGE;

            if (leftSpill && !rightSpill) {
                const extraPages = range(
                    startPage - singleSpillOffset,
                    startPage - 1
                );
                pages = [leftSpillPage, ...extraPages, ...pages];
            } else if (!leftSpill && rightSpill) {
                const extraPages = range(
                    endPage + 1,
                    endPage + singleSpillOffset
                );
                pages = [...pages, ...extraPages, rightSpillPage];
            } else if (leftSpill && rightSpill) {
                pages = [leftSpillPage, ...pages, rightSpillPage];
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    };

    render() {
        if (!this.totalRecords) return null;
        if (this.totalPages === 1) return null;

        const currentPage = this.props.page;
        const pages = this.fetchPageNumbers();

        return (
            <div className="pagination-wrap">
                <nav aria-label="Pagination">
                    <ul className="pagination">
                        {pages.map((page, index) => {
                            if (page === LEFT_PAGE)
                                return (
                                    <li key={index} className="page-item">
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Previous"
                                            onClick={this.handleMoveLeft}
                                        >
                                            <span aria-hidden="true">
                                                &laquo;
                                            </span>
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                        </a>
                                    </li>
                                );

                            if (page === RIGHT_PAGE)
                                return (
                                    <li key={index} className="page-item">
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Next"
                                            onClick={this.handleMoveRight}
                                        >
                                            <span aria-hidden="true">
                                                &raquo;
                                            </span>
                                            <span className="sr-only">
                                                Next
                                            </span>
                                        </a>
                                    </li>
                                );

                            return (
                                <li
                                    key={index}
                                    className={`page-item${
                                        currentPage === page ? " active" : ""
                                    }`}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        onClick={e => this.handleClick(page, e)}
                                    >
                                        {page}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        page: store.page.page
    };
};

export default connect(mapStateToProps)(Pagination);

Pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageNeighbours: PropTypes.number,
    onPageChanged: PropTypes.func
};
